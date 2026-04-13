"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { registerSchema, type RegisterValues } from "@/lib/auth-schemas";
import { useAuth, getApiErrorMessage } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await registerUser(values);
      toast.success("Cadastro feito", { description: "Indo ao painel." });
      router.replace("/dashboard");
    } catch (e) {
      toast.error("Cadastro não concluído", {
        description: getApiErrorMessage(e, "Revise os dados e tente de novo."),
      });
    }
  });

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center lg:text-left">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent lg:mx-0">
          <UserPlus className="size-6" aria-hidden />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Cadastro</h2>
        <p className="text-sm text-muted">Repita a senha no último campo.</p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="reg-email">E-mail</Label>
          <Input
            id="reg-email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "reg-email-error" : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p id="reg-email-error" className="text-sm text-red-500 dark:text-red-400" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-password">Senha</Label>
          <Input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "reg-password-error" : undefined}
            {...register("password")}
          />
          {errors.password ? (
            <p id="reg-password-error" className="text-sm text-red-500 dark:text-red-400" role="alert">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-confirm">Confirmar senha</Label>
          <Input
            id="reg-confirm"
            type="password"
            autoComplete="new-password"
            aria-invalid={errors.confirmPassword ? "true" : "false"}
            aria-describedby={errors.confirmPassword ? "reg-confirm-error" : undefined}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword ? (
            <p
              id="reg-confirm-error"
              className="text-sm text-red-500 dark:text-red-400"
              role="alert"
            >
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          {isSubmitting ? "Criando conta…" : "Criar conta"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link
          href="/login"
          className={cn("font-medium text-accent underline-offset-4 hover:underline")}
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
