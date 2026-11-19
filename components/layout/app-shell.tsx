"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { NavLink } from "./nav-link";
import { primaryNavigation, settingsNavigation } from "./navigation";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

function Brand() { return <Link href="/dashboard" className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none"><span className="grid size-9 place-items-center rounded-xl bg-primary font-mono text-sm font-bold text-primary-foreground">R</span><span className="text-lg font-semibold tracking-tight">Reperto</span></Link>; }

export function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-background">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-surface-1 p-4 lg:flex lg:flex-col">
      <div className="px-2 py-2"><Brand /></div>
      <nav className="mt-7 grid gap-1" aria-label="Primary navigation">{primaryNavigation.map((item) => <NavLink key={item.href} {...item} />)}</nav>
      <div className="mt-auto space-y-3"><NavLink {...settingsNavigation} /><ThemeSwitcher /><p className="px-2 text-xs text-muted-foreground">Build your repertoire.<br />Understand every move.</p></div>
    </aside>
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:hidden">
      <Brand />
      <Sheet><SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open menu"><Menu className="size-5" /></Button>} />
        <SheetContent side="right" className="w-[min(88vw,22rem)] p-5"><SheetHeader><SheetTitle>Reperto</SheetTitle><SheetDescription>Navigation and appearance</SheetDescription></SheetHeader><nav className="mt-6 grid gap-1" aria-label="Mobile menu">{[...primaryNavigation, settingsNavigation].map((item) => <NavLink key={item.href} {...item} />)}</nav><div className="mt-6"><ThemeSwitcher /></div></SheetContent>
      </Sheet>
    </header>
    <main className="pb-24 lg:ml-64 lg:pb-0"><div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">{children}</div></main>
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t bg-background/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden" aria-label="Bottom navigation">{primaryNavigation.map((item) => <NavLink key={item.href} {...item} compact />)}</nav>
  </div>;
}
