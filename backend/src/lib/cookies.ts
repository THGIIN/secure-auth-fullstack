import type { Response } from "express";
import { env } from "../config/env.js";

const msPerDay = 86_400_000;

export function getRefreshCookieOptions(maxAgeMs: number) {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeMs,
  };
}

export function setRefreshTokenCookie(res: Response, rawToken: string): void {
  const maxAge = env.REFRESH_TOKEN_EXPIRES_DAYS * msPerDay;
  res.cookie(env.REFRESH_COOKIE_NAME, rawToken, getRefreshCookieOptions(maxAge));
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(env.REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}
