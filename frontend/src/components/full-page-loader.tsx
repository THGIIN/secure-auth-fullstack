import { Loader2 } from "lucide-react";

export function FullPageLoader({ label = "Carregando sessão…" }: { label?: string }) {
  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-surface px-4 motion-safe:animate-ios-fade-in motion-reduce:animate-none"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative flex size-14 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-accent/12 ring-1 ring-accent/20" aria-hidden />
        <Loader2
          className="relative size-8 animate-spin text-accent motion-reduce:animate-none"
          aria-hidden
        />
      </div>
      <p className="text-sm font-medium tracking-tight text-muted">{label}</p>
    </div>
  );
}
