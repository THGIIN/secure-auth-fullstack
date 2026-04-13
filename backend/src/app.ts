import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { getCorsOriginOption } from "./lib/cors-origins.js";
import { sendError } from "./lib/api-response.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { authRouter } from "./routes/auth.routes.js";
import { healthRouter } from "./routes/health.routes.js";
import { meRouter } from "./routes/me.routes.js";

export function createApp() {
  const app = express();

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );
  app.use(
    cors({
      origin: getCorsOriginOption(),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());

  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/me", meRouter);

  app.use((_req, res) => {
    sendError(res, 404, "NOT_FOUND", "Recurso não encontrado");
  });

  app.use(errorMiddleware);

  return app;
}
