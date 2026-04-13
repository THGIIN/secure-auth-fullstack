import { Router } from "express";
import { env } from "../config/env.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { loginBodySchema, registerBodySchema } from "../schemas/auth.schemas.js";
import { sendSuccess } from "../lib/api-response.js";
import { loginUser, logoutSession, refreshSession, registerUser } from "../services/auth.service.js";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../lib/cookies.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerBodySchema), async (req, res, next) => {
  try {
    const { user, accessToken, rawRefresh } = await registerUser(req.body);
    setRefreshTokenCookie(res, rawRefresh);
    sendSuccess(res, { user, accessToken }, 201);
  } catch (e) {
    next(e);
  }
});

authRouter.post("/login", validateBody(loginBodySchema), async (req, res, next) => {
  try {
    const { user, accessToken, rawRefresh } = await loginUser(req.body);
    setRefreshTokenCookie(res, rawRefresh);
    sendSuccess(res, { user, accessToken });
  } catch (e) {
    next(e);
  }
});

authRouter.post("/refresh", async (req, res, next) => {
  try {
    const fromCookie = req.cookies?.[env.REFRESH_COOKIE_NAME] as string | undefined;
    const { accessToken, rawRefresh } = await refreshSession(fromCookie);
    setRefreshTokenCookie(res, rawRefresh);
    sendSuccess(res, { accessToken });
  } catch (e) {
    next(e);
  }
});

authRouter.post("/logout", async (req, res, next) => {
  try {
    const raw = req.cookies?.[env.REFRESH_COOKIE_NAME] as string | undefined;
    await logoutSession(raw);
    clearRefreshTokenCookie(res);
    sendSuccess(res, { ok: true });
  } catch (e) {
    next(e);
  }
});
