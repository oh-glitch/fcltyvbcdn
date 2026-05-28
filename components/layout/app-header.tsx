"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { AppNav } from "@/components/layout/app-nav";
import { Button } from "@/components/ui/button";

export function AppHeader({
  title,
  subtitle,
  leadingSlot
}: {
  title: string;
  subtitle?: string;
  leadingSlot?: React.ReactNode;
}) {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-3 md:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {leadingSlot}
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold md:text-base">{title}</h1>
          {subtitle ? (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        <AppNav className="hidden sm:flex" />
      </div>

      <div className="flex items-center gap-2">
        <AppNav className="sm:hidden" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
          }
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
