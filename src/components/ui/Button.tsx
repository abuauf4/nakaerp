import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "technical-gradient text-on-primary font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all",
      secondary: "border border-primary text-primary hover:bg-primary/10 transition-colors",
      tertiary: "bg-surface-container-high text-on-surface hover:bg-surface-bright transition-colors",
      ghost: "hover:bg-surface-container-highest transition-colors text-on-surface-variant hover:text-on-surface",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-6 py-4 text-sm font-headline",
      lg: "px-8 py-5 text-base font-headline",
      icon: "w-10 h-10 flex items-center justify-center",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
