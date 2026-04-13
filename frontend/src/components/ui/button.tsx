import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
  loading?: boolean;
  asChild?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", loading, disabled, asChild, children, type, ...props },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref as never}
        type={asChild ? undefined : type ?? "button"}
        className={cn(
          "inline-flex h-11 items-center justify-center gap-2 rounded-ios px-5 text-sm font-semibold tracking-tight",
          "transition-all duration-ios-short ease-ios-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          "motion-safe:active:scale-[0.98] motion-reduce:active:scale-100",
          "disabled:pointer-events-none disabled:opacity-45 disabled:saturate-50",
          "ring-offset-surface",
          variant === "primary" &&
            "bg-accent text-accent-foreground shadow-ios-float hover:brightness-105 dark:hover:brightness-110",
          variant === "ghost" &&
            "text-foreground hover:bg-foreground/[0.06] active:bg-foreground/[0.1]",
          variant === "outline" &&
            "border border-border/80 bg-surface-elevated/40 backdrop-blur-md hover:bg-foreground/[0.06] hover:border-border active:bg-foreground/[0.08]",
          className,
        )}
        disabled={asChild ? undefined : isDisabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading ? (
              <Loader2
                className="size-4 shrink-0 animate-spin motion-reduce:animate-none text-current"
                aria-hidden
              />
            ) : null}
            {children}
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";
