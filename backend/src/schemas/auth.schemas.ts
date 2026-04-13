import { z } from "zod";

export const registerBodySchema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .max(128, "Senha muito longa")
    .regex(/[A-Z]/, "Inclua ao menos uma letra maiúscula")
    .regex(/[a-z]/, "Inclua ao menos uma letra minúscula")
    .regex(/[0-9]/, "Inclua ao menos um número"),
});

export const loginBodySchema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(1, "Informe a senha").max(128),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
