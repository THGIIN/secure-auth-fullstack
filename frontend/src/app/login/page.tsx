import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { GuestOnly } from "@/components/auth/guest-only";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function LoginPage() {
  return (
    <GuestOnly>
      <AuthShell title="Entrar" subtitle="Informe e-mail e senha para acessar o painel.">
        <LoginForm />
      </AuthShell>
    </GuestOnly>
  );
}
