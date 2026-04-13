import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-ios-lg border border-border/70 bg-surface-elevated/65 p-8",
        "shadow-ios-card backdrop-blur-2xl backdrop-saturate-150 transition-all duration-ios ease-ios-out",
        "dark:border-border/50 dark:shadow-ios-card-dark",
        "motion-safe:hover:border-border motion-safe:hover:shadow-ios-float",
        className,
      )}
      {...props}
    />
  );
}
