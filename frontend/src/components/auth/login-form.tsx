"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { loginSchema, type LoginValues } from "@/lib/auth-schemas";
import { useAuth, getApiErrorMessage } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values);
      toast.success("Ok", { description: "Abrindo o painel." });
      router.replace("/dashboard");
    } catch (e) {
      toast.error("Não foi possível entrar", {
        description: getApiErrorMessage(e, "Tente novamente em instantes."),
      });
    }
  });

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center lg:text-left">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent lg:mx-0">
          <LogIn className="size-6" aria-hidden />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Entrar</h2>
        <p className="text-sm text-muted">E-mail e senha cadastrados.</p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p id="email-error" className="text-sm text-red-500 dark:text-red-400" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
          {errors.password ? (
            <p id="password-error" className="text-sm text-red-500 dark:text-red-400" role="alert">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          {isSubmitting ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        Ainda não tem conta?{" "}
        <Link
          href="/register"
          className={cn("font-medium text-accent underline-offset-4 hover:underline")}
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
}
