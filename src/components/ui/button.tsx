import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none";

    const variants = {
      default:
        "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/85",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-accent",
      outline:
        "border border-border bg-background hover:bg-secondary hover:text-foreground",
      ghost:
        "hover:bg-secondary hover:text-foreground",
      link:
        "text-primary underline-offset-4 hover:underline p-0 h-auto",
    };

    const sizes = {
      default: "min-h-11 px-5 py-2.5",
      sm: "min-h-10 rounded-md px-3.5 text-sm",
      lg: "min-h-12 rounded-md px-6 text-base",
      icon: "h-11 w-11",
    };

    return (
      <button
        className={cn(base, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
