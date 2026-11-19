import { BookOpenText, ChartNoAxesCombined, LayoutDashboard, Settings, Swords } from "lucide-react";
export const primaryNavigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/repertoires", label: "Repertoires", icon: BookOpenText },
  { href: "/train", label: "Train", icon: Swords },
  { href: "/progress", label: "Progress", icon: ChartNoAxesCombined },
] as const;
export const settingsNavigation = { href: "/settings", label: "Settings", icon: Settings } as const;
