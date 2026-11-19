"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
export function NavLink({ href, label, icon: Icon, compact = false }: { href: string; label: string; icon: LucideIcon; compact?: boolean }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return <Link href={href} aria-current={active ? "page" : undefined} className={cn("relative flex min-h-11 items-center rounded-xl text-sm font-medium transition-colors", compact ? "flex-col justify-center gap-1 px-2 text-[11px]" : "gap-3 px-3", active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
    {!compact && active ? <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary" aria-hidden="true" /> : null}
    <Icon className="size-5" aria-hidden="true" /><span>{label}</span>
  </Link>;
}
