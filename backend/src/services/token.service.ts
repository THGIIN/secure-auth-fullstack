import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AccessTokenPayload {
  sub: string;
  type: "access";
}

export function signAccessToken(userId: string): string {
  const payload: AccessTokenPayload = { sub: userId, type: "access" };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
    issuer: "auth-backend",
    audience: "auth-frontend",
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
    issuer: "auth-backend",
    audience: "auth-frontend",
  });
  if (typeof decoded === "string" || decoded.type !== "access" || !decoded.sub) {
    throw new Error("Token inválido");
  }
  return decoded as AccessTokenPayload;
}
