import type { RequestHandler } from "express";
import { sendError } from "../lib/api-response.js";
import { verifyAccessToken } from "../services/token.service.js";

export const authMiddleware: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    sendError(res, 401, "UNAUTHORIZED", "Token de acesso ausente");
    return;
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    sendError(res, 401, "UNAUTHORIZED", "Token de acesso ausente");
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub };
    next();
  } catch {
    sendError(res, 401, "UNAUTHORIZED", "Token inválido ou expirado");
  }
};
