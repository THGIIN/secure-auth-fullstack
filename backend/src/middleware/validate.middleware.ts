import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";
import { sendError } from "../lib/api-response.js";

export function validateBody<T>(schema: ZodSchema<T>): RequestHandler {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, "VALIDATION_ERROR", "Dados inválidos", parsed.error.flatten());
      return;
    }
    req.body = parsed.data;
    next();
  };
}
