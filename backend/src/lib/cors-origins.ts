import { env } from "../config/env.js";

// Em desenvolvimento aceita localhost e 127.0.0.1 como origens equivalentes para CORS.
export function getCorsOriginOption(): string | string[] {
  const primary = env.FRONTEND_ORIGIN.replace(/\/$/, "");

  if (env.NODE_ENV !== "development") {
    return primary;
  }

  const set = new Set<string>([primary]);
  try {
    const u = new URL(primary);
    const twin = new URL(primary);
    if (u.hostname === "localhost") {
      twin.hostname = "127.0.0.1";
    } else if (u.hostname === "127.0.0.1") {
      twin.hostname = "localhost";
    }
    if (twin.hostname !== u.hostname) {
      set.add(twin.toString().replace(/\/$/, ""));
    }
  } catch {
    /* mantém só primary */
  }

  return Array.from(set);
}
