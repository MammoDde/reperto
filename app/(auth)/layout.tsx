import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
export default function AuthLayout({ children }: { children: React.ReactNode }) { return <main className="grid min-h-dvh place-items-center bg-background p-4"><div className="fixed right-4 top-4 w-64 max-w-[calc(100vw-2rem)]"><ThemeSwitcher /></div><div className="w-full max-w-md"><Link href="/" className="mb-8 block text-center text-xl font-semibold">Reperto</Link>{children}</div></main>; }
