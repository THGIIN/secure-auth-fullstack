import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

type AuthShellProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
};

export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-surface">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-25%,hsl(var(--accent)/0.2),transparent_55%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface to-transparent opacity-80" aria-hidden />
      <div className="absolute right-4 top-4 z-10 motion-safe:animate-ios-fade-in motion-reduce:animate-none">
        <ThemeToggle />
      </div>
      <div className="relative mx-auto grid min-h-dvh max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div className="hidden flex-col justify-center gap-8 lg:flex">
          <Link
            href="/"
            className="motion-safe:animate-ios-fade-in motion-reduce:animate-none inline-flex w-fit items-center gap-2 text-sm font-medium text-muted transition-colors duration-ios-short ease-ios-out hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Início
          </Link>
          <div className="space-y-4">
            <h1 className="motion-safe:animate-ios-fade-in motion-reduce:animate-none text-4xl font-semibold tracking-tight text-foreground md:text-5xl [animation-delay:60ms]">
              {title}
            </h1>
            <p className="motion-safe:animate-ios-fade-in motion-reduce:animate-none max-w-md text-lg leading-relaxed text-muted [animation-delay:120ms]">
              {subtitle}
            </p>
          </div>
        </div>
        <Card className="motion-safe:animate-ios-fade-in motion-reduce:animate-none mx-auto w-full max-w-md shadow-ios-float [animation-delay:100ms] [animation-fill-mode:both]">
          {children}
        </Card>
      </div>
    </div>
  );
}
