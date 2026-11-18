$Project = "C:\Users\davide.mammone\OneDrive - MSC\Desktop\reperto"
$Output = "C:\Temp\reperto.zip"
$Base64Output = "C:\Temp\reperto.zip.base64.txt"

$ErrorActionPreference = "Stop"

# Cartelle da escludere, anche quando si trovano in sottocartelle
$ExcludedDirectories = @(
    ".git"
    "node_modules"
    ".next"
    "coverage"
    ".vercel"
    "src/generated/prisma"
)

# File da escludere
$ExcludedFiles = @(
    ".env"
    ".env.local"
    ".env.example"
    "genera-zip.ps1"
    "/*./tsbuildinfo"
)

Write-Host ""
Write-Host "Preparazione archivio Finora..." -ForegroundColor Cyan

# Verifica che la cartella del progetto esista
if (-not (Test-Path -LiteralPath $Project -PathType Container)) {
    throw "La cartella del progetto non esiste: $Project"
}

# Crea la cartella di destinazione, se necessario
$OutputDirectory = Split-Path -Path $Output -Parent

if (-not (Test-Path -LiteralPath $OutputDirectory -PathType Container)) {
    New-Item `
        -ItemType Directory `
        -Path $OutputDirectory `
        -Force |
        Out-Null
}

# Elimina gli output precedenti
Remove-Item `
    -LiteralPath $Output `
    -Force `
    -ErrorAction SilentlyContinue

Remove-Item `
    -LiteralPath $Base64Output `
    -Force `
    -ErrorAction SilentlyContinue

# Carica le librerie necessarie per creare lo ZIP
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

Write-Host "Analisi dei file del progetto..." -ForegroundColor Cyan

# Enumera tutti i file da inserire nello ZIP
# @() garantisce che $Files sia sempre un array
$Files = @(
    Get-ChildItem `
        -LiteralPath $Project `
        -File `
        -Recurse `
        -Force `
        -ErrorAction Stop |
        Where-Object {
            $CurrentFile = $_

            # Esclude i file in base al nome
            if ($ExcludedFiles -contains $CurrentFile.Name) {
                return $false
            }

            # Calcola il percorso relativo rispetto alla cartella del progetto
            $RelativePath = $CurrentFile.FullName.Substring($Project.Length)
            $RelativePath = $RelativePath.TrimStart("\", "/")

            # Divide il percorso nelle singole componenti
            $PathParts = $RelativePath -split "[\\/]"

            # Esclude il file se il suo percorso contiene
            # una delle cartelle escluse
            foreach ($ExcludedDirectory in $ExcludedDirectories) {
                if ($PathParts -contains $ExcludedDirectory) {
                    return $false
                }
            }

            return $true
        }
)

Write-Host ""
Write-Host "File trovati da inserire: $($Files.Count)" -ForegroundColor Cyan

# Interrompe l'esecuzione se non è stato trovato alcun file
if ($Files.Count -eq 0) {
    Write-Host ""
    Write-Host "Contenuto rilevato nella cartella del progetto:" -ForegroundColor Yellow

    Get-ChildItem `
        -LiteralPath $Project `
        -Force |
        Select-Object Name, FullName, Attributes |
        Format-Table -AutoSize

    throw "Nessun file valido trovato. Lo ZIP non verra creato."
}

$FileStream = $null
$Archive = $null
$AddedFiles = 0

try {
    # Crea il file ZIP
    $FileStream = [System.IO.File]::Open(
        $Output,
        [System.IO.FileMode]::Create,
        [System.IO.FileAccess]::Write,
        [System.IO.FileShare]::None
    )

    # Apre il nuovo archivio in modalita creazione
    $Archive = [System.IO.Compression.ZipArchive]::new(
        $FileStream,
        [System.IO.Compression.ZipArchiveMode]::Create,
        $false
    )

    foreach ($CurrentFile in $Files) {
        # Calcola il percorso relativo del file
        $RelativePath = $CurrentFile.FullName.Substring($Project.Length)
        $RelativePath = $RelativePath.TrimStart("\", "/")

        # All'interno degli ZIP i separatori devono essere slash
        $ZipEntryName = $RelativePath.Replace("\", "/")

        Write-Host "Aggiungo: $ZipEntryName"

        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
            $Archive,
            $CurrentFile.FullName,
            $ZipEntryName,
            [System.IO.Compression.CompressionLevel]::Optimal
        ) | Out-Null

        $AddedFiles++
    }
}
finally {
    # Chiude prima l'archivio
    if ($null -ne $Archive) {
        $Archive.Dispose()
    }

    # Chiude successivamente il file ZIP
    if ($null -ne $FileStream) {
        $FileStream.Dispose()
    }
}

# Verifica che il file ZIP sia stato creato
if (-not (Test-Path -LiteralPath $Output -PathType Leaf)) {
    throw "Lo ZIP non e stato creato."
}

# Recupera le informazioni sul file ZIP
[System.IO.FileInfo]$ZipInfo = Get-Item -LiteralPath $Output

# Verifica che lo ZIP abbia una dimensione maggiore di zero
if ($ZipInfo.Length -le 0) {
    throw "Lo ZIP e stato creato con dimensione pari a zero."
}

Write-Host ""
Write-Host "Verifica dell'archivio ZIP..." -ForegroundColor Cyan

$VerificationArchive = $null
$EntryCount = 0

try {
    # Riapre lo ZIP appena creato
    $VerificationArchive = [System.IO.Compression.ZipFile]::OpenRead($Output)

    # Conta realmente le voci presenti nell'archivio
    $EntryCount = $VerificationArchive.Entries.Count

    if ($EntryCount -eq 0) {
        throw "Lo ZIP e formalmente valido, ma non contiene alcuna voce."
    }

    # Verifica che ogni voce abbia un nome valido
    foreach ($Entry in $VerificationArchive.Entries) {
        if ([System.String]::IsNullOrWhiteSpace($Entry.FullName)) {
            throw "Lo ZIP contiene una voce priva di nome."
        }
    }
}
finally {
    if ($null -ne $VerificationArchive) {
        $VerificationArchive.Dispose()
    }
}

# Verifica la corrispondenza fra file aggiunti e voci nello ZIP
if ($EntryCount -ne $AddedFiles) {
    throw "Verifica non riuscita. File aggiunti: $AddedFiles. Voci presenti nello ZIP: $EntryCount."
}

Write-Host "Generazione del file Base64..." -ForegroundColor Cyan

# Legge lo ZIP e lo converte in Base64
$Bytes = [System.IO.File]::ReadAllBytes($Output)
$Base64 = [System.Convert]::ToBase64String($Bytes)

# Scrive il Base64 usando la codifica ASCII
[System.IO.File]::WriteAllText(
    $Base64Output,
    $Base64,
    [System.Text.Encoding]::ASCII
)

# Verifica che il file Base64 sia stato creato
if (-not (Test-Path -LiteralPath $Base64Output -PathType Leaf)) {
    throw "Il file Base64 non e stato creato."
}

[System.IO.FileInfo]$Base64Info = Get-Item -LiteralPath $Base64Output

if ($Base64Info.Length -le 0) {
    throw "Il file Base64 e stato creato, ma risulta vuoto."
}

# Calcola le dimensioni in MB
$ZipSizeMB = [System.Math]::Round(
    ([double]$ZipInfo.Length / 1MB),
    2
)

$Base64SizeMB = [System.Math]::Round(
    ([double]$Base64Info.Length / 1MB),
    2
)

Write-Host ""
Write-Host "Operazione completata correttamente." -ForegroundColor Green
Write-Host ""
Write-Host "ZIP: $Output"
Write-Host "Dimensione ZIP: $ZipSizeMB MB"
Write-Host "File inseriti: $AddedFiles"
Write-Host "Voci verificate: $EntryCount"
Write-Host ""
Write-Host "Base64: $Base64Output"
Write-Host "Dimensione Base64: $Base64SizeMB MB"
Write-Host ""