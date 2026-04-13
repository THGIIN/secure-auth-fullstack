import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { GuestOnly } from "@/components/auth/guest-only";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Cadastro",
};

export default function RegisterPage() {
  return (
    <GuestOnly>
      <AuthShell
        title="Cadastro"
        subtitle="A senha precisa ter 8+ caracteres, maiúscula, minúscula e número."
      >
        <RegisterForm />
      </AuthShell>
    </GuestOnly>
  );
}
