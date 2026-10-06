"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export type ActionState = { ok: boolean; message: string };

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom est trop long"),
  email: z
    .string()
    .trim()
    .min(1, "L'email est requis")
    .email("Email invalide"),
  phone: z
    .string()
    .trim()
    .max(20, "Numéro invalide")
    .regex(/^(\+?[0-9\s]{8,15})?$/, "Numéro invalide"),
});

export async function updateProfile(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, message: "Session expirée, reconnectez-vous" };

  const parsed = profileSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { name, email, phone } = parsed.data;

  try {
    const current = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { preferences: true },
    });

    const previous =
      current?.preferences &&
      typeof current.preferences === "object" &&
      !Array.isArray(current.preferences)
        ? (current.preferences as Record<string, unknown>)
        : {};

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email: email.toLowerCase(),
        // phone est unique : une chaîne vide doit devenir null
        phone: phone === "" ? null : phone,
        preferences: {
          ...previous,
          emailNotifications: formData.get("emailNotifications") === "on",
          smsNotifications: formData.get("smsNotifications") === "on",
          marketingEmails: formData.get("marketingEmails") === "on",
        },
      },
    });

    revalidatePath("/", "layout");
    return { ok: true, message: "Paramètres enregistrés avec succès" };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { ok: false, message: "Cet email ou ce téléphone est déjà utilisé" };
    }
    console.error("[SETTINGS_UPDATE]", error);
    return { ok: false, message: "Erreur lors de l'enregistrement des paramètres" };
  }
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Saisissez votre mot de passe actuel"),
    newPassword: z
      .string()
      .min(8, "Minimum 8 caractères")
      .regex(/[A-Z]/, "Au moins une majuscule")
      .regex(/[0-9]/, "Au moins un chiffre"),
    confirmPassword: z.string().min(1, "Confirmez le nouveau mot de passe"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export async function changePassword(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, message: "Session expirée, reconnectez-vous" };

  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword") ?? "",
    newPassword: formData.get("newPassword") ?? "",
    confirmPassword: formData.get("confirmPassword") ?? "",
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user?.password) {
      return { ok: false, message: "Aucun mot de passe défini pour ce compte" };
    }

    const valid = await bcrypt.compare(parsed.data.currentPassword, user.password);
    if (!valid) {
      return { ok: false, message: "Mot de passe actuel incorrect" };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: await bcrypt.hash(parsed.data.newPassword, 12) },
    });

    return { ok: true, message: "Mot de passe modifié avec succès" };
  } catch (error) {
    console.error("[SETTINGS_PASSWORD]", error);
    return { ok: false, message: "Erreur lors du changement de mot de passe" };
  }
}
