"use client";

import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh motion-safe:animate-ios-enter motion-reduce:animate-none">{children}</div>
  );
}
