"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import type { ReactNode } from "react";
import { AuthProvider } from "@/contexts/auth-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        {children}
        <Toaster
          richColors
          closeButton
          position="top-center"
          offset={20}
          gap={10}
          toastOptions={{
            duration: 4200,
            classNames: {
              toast:
                "rounded-ios-lg border border-border/60 bg-surface-elevated/85 text-foreground shadow-ios-float backdrop-blur-2xl backdrop-saturate-150 dark:bg-zinc-900/80",
              title: "font-semibold tracking-tight",
              description: "text-muted opacity-95",
              closeButton:
                "rounded-lg border-0 bg-foreground/5 transition-colors duration-ios-short hover:bg-foreground/10",
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
