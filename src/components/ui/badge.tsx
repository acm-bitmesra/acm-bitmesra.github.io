import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive" | "success" | "warning";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/15 dark:text-red-300",
    secondary: "border-border bg-secondary text-secondary-foreground",
    outline: "border-border bg-transparent text-muted-foreground",
    destructive: "border-destructive/20 bg-destructive/10 text-red-700 dark:text-red-300",
    success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    warning: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  };

  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-full border px-2.5 py-1 text-xs font-medium leading-none transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
