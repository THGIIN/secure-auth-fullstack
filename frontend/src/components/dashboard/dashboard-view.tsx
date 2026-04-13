"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut, Mail, User } from "lucide-react";
import { useAuth, getApiErrorMessage } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export function DashboardView() {
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      toast.success("Sessão encerrada");
      router.replace("/login");
    } catch (e) {
      toast.error("Erro ao sair", { description: getApiErrorMessage(e, "Tente novamente.") });
    }
  }

  return (
    <div className="min-h-dvh bg-surface">
      <header className="border-b border-border/60 bg-surface-elevated/55 shadow-[0_1px_0_0_hsl(var(--border)/0.35)] backdrop-blur-2xl backdrop-saturate-150 transition-[background,box-shadow] duration-ios ease-ios-out">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-foreground transition-opacity duration-ios-short ease-ios-out hover:opacity-75 active:opacity-60"
          >
            Início
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button type="button" variant="outline" className="gap-2" onClick={handleLogout}>
              <LogOut className="size-4" aria-hidden />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-10 md:px-8">
        <div className="motion-safe:animate-ios-fade-in motion-reduce:animate-none space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Painel</h1>
          <p className="max-w-2xl text-muted">
            Dados da conta abaixo. Se recarregar a página e ainda estiver logado, o refresh no cookie
            está funcionando.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="motion-safe:animate-ios-fade-in motion-reduce:animate-none space-y-4 [animation-delay:80ms] [animation-fill-mode:both]">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <User className="size-5" aria-hidden />
              </div>
              <div>
                <p className="text-sm text-muted">Conta</p>
                <p className="font-medium text-foreground">Ativa</p>
              </div>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
                <div>
                  <dt className="text-muted">E-mail</dt>
                  <dd className="break-all text-foreground">{user?.email}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
                <div>
                  <dt className="text-muted">ID</dt>
                  <dd className="break-all font-mono text-xs text-foreground">{user?.id}</dd>
                </div>
              </div>
            </dl>
          </Card>

          <Card className="motion-safe:animate-ios-fade-in motion-reduce:animate-none flex flex-col justify-between gap-6 [animation-delay:140ms] [animation-fill-mode:both]">
            <p className="text-sm text-muted">Atalho para a página inicial.</p>
            <Button type="button" variant="ghost" className="w-fit" asChild>
              <Link href="/">Voltar</Link>
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
