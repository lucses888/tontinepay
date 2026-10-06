import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Email invalide"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(6, "Minimum 6 caractères"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(50, "Le nom est trop long"),
    email: z
      .string()
      .min(1, "L'email est requis")
      .email("Email invalide"),
    phone: z
      .string()
      .min(8, "Numéro invalide")
      .max(15, "Numéro invalide")
      .regex(/^\+?[0-9\s]+$/, "Numéro invalide"),
    password: z
      .string()
      .min(8, "Minimum 8 caractères")
      .regex(/[A-Z]/, "Au moins une majuscule")
      .regex(/[0-9]/, "Au moins un chiffre"),
    confirmPassword: z.string().min(1, "Confirmez le mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const createTontineSchema = z.object({
  name: z
    .string()
    .min(3, "Minimum 3 caractères")
    .max(60, "Maximum 60 caractères"),
  description: z.string().max(200, "Maximum 200 caractères").optional(),
  amount: z
    .number()
    .min(1000, "Minimum 1 000 XOF")
    .max(10_000_000, "Maximum 10 000 000 XOF"),
  frequency: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY"]),
  maxMembers: z
    .number()
    .min(2, "Minimum 2 membres")
    .max(50, "Maximum 50 membres"),
  rotationMode: z.enum(["MANUAL", "RANDOM", "AUCTION"]).default("MANUAL"),
  isPrivate: z.boolean().default(true),
  requireGuarantee: z.boolean().default(false),
  guaranteeAmount: z.number().optional(),
  latePenaltyAmount: z.number().min(0).default(0),
  latePenaltyType: z.enum(["FIXED", "PERCENTAGE"]).default("FIXED"),
  maxLatePayments: z.number().min(1).max(10).default(3),
  allowPositionSwap: z.boolean().default(true),
});

export const recordContributionSchema = z.object({
  cycleId: z.string().min(1),
  memberId: z.string().min(1),
  amount: z.number().positive(),
  paymentMethod: z.enum([
    "ORANGE_MONEY",
    "MTN_MOMO",
    "WAVE",
    "MOOV_MONEY",
    "FREE_MONEY",
    "BANK_TRANSFER",
    "CASH",
  ]),
  transactionRef: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateTontineInput = z.input<typeof createTontineSchema>;
export type RecordContributionInput = z.infer<typeof recordContributionSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const contactSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  subject: z.string().optional(),
  message: z.string().min(1, "Message requis"),
});

export type ContactInput = z.infer<typeof contactSchema>;
