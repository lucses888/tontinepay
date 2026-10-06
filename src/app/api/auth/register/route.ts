import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";
import { generateSlug } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, password } = parsed.data;

    // Vérifier email unique
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { phone: phone || undefined },
        ],
      },
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? "email" : "téléphone";
      return NextResponse.json(
        { success: false, error: `Ce ${field} est déjà utilisé` },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        kycStatus: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { success: true, data: user, message: "Compte créé avec succès" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);

    // Doublon d'email/téléphone détecté par la base (course entre deux requêtes)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { success: false, error: "Cet email ou ce téléphone est déjà utilisé" },
        { status: 409 }
      );
    }

    // Tables absentes : la migration Prisma n'a pas été appliquée sur Supabase
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2021" || error.code === "P2022")
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Base de données non initialisée (tables manquantes). Lancez : npx prisma migrate dev --name init",
        },
        { status: 503 }
      );
    }

    // Connexion à la base impossible ou URL invalide (DATABASE_URL / DIRECT_URL)
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Connexion à la base de données impossible. Vérifiez DATABASE_URL dans .env.local (mot de passe, région, identifiant du projet Supabase).",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
