import argon2 from "argon2";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/errors.js";
import { createRawRefreshToken, hashRefreshToken } from "../lib/refresh-token.js";
import { signAccessToken } from "./token.service.js";
import { env } from "../config/env.js";
import type { LoginBody, RegisterBody } from "../schemas/auth.schemas.js";

function refreshExpiresAt(): Date {
  const d = new Date();
  d.setDate(d.getDate() + env.REFRESH_TOKEN_EXPIRES_DAYS);
  return d;
}

async function persistRefreshToken(userId: string, rawRefresh: string) {
  const tokenHash = hashRefreshToken(rawRefresh);
  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt: refreshExpiresAt(),
    },
  });
}

export async function registerUser(input: RegisterBody) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError(409, "EMAIL_IN_USE", "Este e-mail já está cadastrado");
  }

  const passwordHash = await argon2.hash(input.password, {
    type: argon2.argon2id,
    memoryCost: 65_536,
    timeCost: 3,
    parallelism: 4,
  });

  const user = await prisma.user.create({
    data: { email: input.email, passwordHash },
    select: { id: true, email: true, createdAt: true },
  });

  const rawRefresh = createRawRefreshToken();
  await persistRefreshToken(user.id, rawRefresh);
  const accessToken = signAccessToken(user.id);

  return { user, accessToken, rawRefresh };
}

export async function loginUser(input: LoginBody) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new AppError(401, "INVALID_CREDENTIALS", "E-mail ou senha incorretos");
  }

  const ok = await argon2.verify(user.passwordHash, input.password);
  if (!ok) {
    throw new AppError(401, "INVALID_CREDENTIALS", "E-mail ou senha incorretos");
  }

  const rawRefresh = createRawRefreshToken();
  await persistRefreshToken(user.id, rawRefresh);
  const accessToken = signAccessToken(user.id);

  return {
    user: { id: user.id, email: user.email, createdAt: user.createdAt },
    accessToken,
    rawRefresh,
  };
}

export async function refreshSession(rawRefreshFromCookie: string | undefined) {
  if (!rawRefreshFromCookie) {
    throw new AppError(401, "REFRESH_MISSING", "Sessão expirada. Faça login novamente.");
  }

  const tokenHash = hashRefreshToken(rawRefreshFromCookie);
  const record = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!record || record.revokedAt) {
    throw new AppError(401, "REFRESH_INVALID", "Sessão inválida. Faça login novamente.");
  }

  if (record.expiresAt < new Date()) {
    await prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });
    throw new AppError(401, "REFRESH_EXPIRED", "Sessão expirada. Faça login novamente.");
  }

  const newRaw = createRawRefreshToken();
  const newHash = hashRefreshToken(newRaw);

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: record.id },
      data: {
        revokedAt: new Date(),
        replacedBy: newHash,
      },
    }),
    prisma.refreshToken.create({
      data: {
        tokenHash: newHash,
        userId: record.userId,
        expiresAt: refreshExpiresAt(),
      },
    }),
  ]);

  const accessToken = signAccessToken(record.userId);
  return { accessToken, rawRefresh: newRaw, userId: record.userId };
}

export async function logoutSession(rawRefreshFromCookie: string | undefined) {
  if (rawRefreshFromCookie) {
    const tokenHash = hashRefreshToken(rawRefreshFromCookie);
    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
