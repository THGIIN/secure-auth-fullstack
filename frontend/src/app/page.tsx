import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-surface">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_-15%,hsl(var(--accent)/0.22),transparent_50%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-surface via-surface/40 to-transparent" aria-hidden />
      <header className="relative mx-auto flex max-w-5xl items-center justify-between px-4 py-6 motion-safe:animate-ios-fade-in motion-reduce:animate-none md:px-8">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          Início
        </Link>
        <ThemeToggle />
      </header>
      <main className="relative mx-auto flex max-w-5xl flex-col gap-12 px-4 pb-24 pt-6 md:px-8 md:pt-12">
        <div className="max-w-2xl space-y-6">
          <h1 className="motion-safe:animate-ios-fade-in motion-reduce:animate-none text-4xl font-semibold tracking-tight text-foreground md:text-5xl [animation-delay:40ms]">
            Entrar ou criar conta
          </h1>
          <p className="motion-safe:animate-ios-fade-in motion-reduce:animate-none text-lg leading-relaxed text-muted [animation-delay:90ms]">
            Use o painel após fazer login. A sessão continua ativa após atualizar a página enquanto o
            refresh em cookie for válido.
          </p>
          <div className="motion-safe:animate-ios-fade-in motion-reduce:animate-none flex flex-wrap gap-3 [animation-delay:140ms]">
            <Button asChild className="group gap-2">
              <Link href="/login">
                Entrar
                <ArrowRight className="size-4 transition-transform duration-ios-short ease-ios-out group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Cadastrar</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
