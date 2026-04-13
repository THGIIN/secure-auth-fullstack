import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-ios border border-border/80 bg-surface-elevated/50 px-3.5 text-[15px] text-foreground placeholder:text-muted/90",
        "backdrop-blur-md transition-all duration-ios-short ease-ios-out",
        "focus-visible:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "motion-safe:focus-visible:shadow-[0_0_0_4px_hsl(var(--accent)/0.12)]",
        "disabled:cursor-not-allowed disabled:opacity-45",
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
