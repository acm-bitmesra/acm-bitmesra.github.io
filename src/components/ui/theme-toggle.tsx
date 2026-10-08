"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ showLabel = false, className = "" }: ThemeToggleProps) {
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");

    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = prefersDark ? "dark" : "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  const base =
    "inline-flex items-center justify-center gap-2 min-h-11 rounded-md border border-border bg-background px-3 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={`h-11 w-11 rounded-md border border-border bg-background flex items-center justify-center text-muted-foreground opacity-60 ${className}`}
        disabled
      >
        <Moon className="h-4 w-4 shrink-0" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`${base} ${showLabel ? "" : "w-11 px-0"} ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 shrink-0 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 shrink-0" />
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </span>
      )}
    </button>
  );
}
