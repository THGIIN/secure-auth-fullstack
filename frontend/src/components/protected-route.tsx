"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { FullPageLoader } from "@/components/full-page-loader";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, bootstrapping } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (bootstrapping) return;
    if (!user) {
      router.replace("/login");
    }
  }, [bootstrapping, user, router]);

  if (bootstrapping || !user) {
    return <FullPageLoader label={bootstrapping ? "Restaurando sessão…" : "Redirecionando…"} />;
  }

  return <>{children}</>;
}
