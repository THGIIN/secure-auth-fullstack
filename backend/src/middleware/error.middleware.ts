import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { sendError } from "../lib/api-response.js";
import { AppError } from "../lib/errors.js";

export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.code, err.message, err.details);
    return;
  }

  if (err instanceof ZodError) {
    sendError(res, 400, "VALIDATION_ERROR", "Dados inválidos", err.flatten());
    return;
  }

  console.error(err);
  sendError(res, 500, "INTERNAL_ERROR", "Erro interno do servidor");
};
