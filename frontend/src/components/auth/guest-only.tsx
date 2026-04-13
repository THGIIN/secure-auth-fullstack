"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { FullPageLoader } from "@/components/full-page-loader";

export function GuestOnly({ children }: { children: ReactNode }) {
  const { user, bootstrapping } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (bootstrapping) return;
    if (user) {
      router.replace("/dashboard");
    }
  }, [bootstrapping, user, router]);

  if (bootstrapping) {
    return <FullPageLoader />;
  }

  if (user) {
    return <FullPageLoader label="Redirecionando…" />;
  }

  return <>{children}</>;
}
