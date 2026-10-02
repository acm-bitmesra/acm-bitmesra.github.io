import * as React from "react";
import { cn } from "@/lib/utils";

interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
}

export function Callout({ icon, className, children, ...props }: CalloutProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3.5 rounded-lg border border-border/70 bg-secondary/40 p-4 text-sm leading-relaxed text-foreground transition-colors dark:bg-neutral-900/40",
        className
      )}
      {...props}
    >
      {icon && <div className="mt-0.5 shrink-0 text-muted-foreground">{icon}</div>}
      <div className="flex-1 space-y-1">{children}</div>
    </div>
  );
}
