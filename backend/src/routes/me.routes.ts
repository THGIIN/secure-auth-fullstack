import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { sendSuccess } from "../lib/api-response.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/errors.js";

export const meRouter = Router();

meRouter.get("/", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, "UNAUTHORIZED", "Não autenticado");
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, createdAt: true },
    });
    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "Usuário não encontrado");
    }
    sendSuccess(res, { user });
  } catch (e) {
    next(e);
  }
});
