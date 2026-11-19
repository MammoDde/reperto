"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const themeOptions = [
  {
    value: "light",
    label: "Light",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    icon: Monitor,
  },
] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <fieldset
      className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1"
      aria-label="Color theme"
    >
      <legend className="sr-only">Color theme</legend>

      {themeOptions.map(({ value, label, icon: Icon }) => {
        const isSelected = theme === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={isSelected}
            className="flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm"
          >
            <Icon className="size-3.5" aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </fieldset>
  );
}