import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/protected-route";

export const metadata: Metadata = {
  title: "Painel",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
