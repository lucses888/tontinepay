import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { createTontineSchema } from "@/lib/validations/auth";
import { generateSlug, calculateDueDate } from "@/lib/utils";

// GET /api/tontines — liste des tontines de l'utilisateur connecté
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") ?? "1");
    const pageSize = parseInt(searchParams.get("pageSize") ?? "10");
    const skip = (page - 1) * pageSize;

    const statusFilter = status
      ? (status as "DRAFT" | "PENDING" | "ACTIVE" | "COMPLETED" | "DISSOLVED")
      : undefined;

    const whereClause = {
      members: {
        some: {
          userId: session.user.id,
          status: { not: "EXCLUDED" as const },
        },
      },
      ...(statusFilter ? { status: statusFilter } : {}),
    };

    const [tontines, total] = await Promise.all([
      prisma.tontine.findMany({
        where: whereClause,
        include: {
          members: {
            where: { status: { not: "EXCLUDED" } },
            include: {
              user: { select: { id: true, name: true, image: true } },
            },
          },
          cycles: {
            where: { status: "ACTIVE" },
            take: 1,
            orderBy: { cycleNumber: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.tontine.count({
        where: whereClause,
      }),
    ]);

    const tontinesWithMeta = tontines.map((t) => {
      const userMember = t.members.find((m) => m.userId === session.user.id);
      const activeCycle = t.cycles[0];

      return {
        id: t.id,
        name: t.name,
        slug: t.slug,
        amount: t.amount,
        currency: t.currency,
        frequency: t.frequency,
        status: t.status,
        maxMembers: t.maxMembers,
        currentCycle: t.currentCycle,
        totalCycles: t.totalCycles,
        memberCount: t.members.length,
        collectedThisCycle: activeCycle?.collectedAmount ?? 0,
        nextDueDate: activeCycle?.dueDate ?? null,
        isAdmin: userMember?.role === "ADMIN" || userMember?.role === "CO_ADMIN",
        userHasPaid: false, // TODO: vérifier si l'utilisateur a payé
        createdAt: t.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: tontinesWithMeta,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("[TONTINES_GET]", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/tontines — créer une nouvelle tontine
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createTontineSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const baseSlug = generateSlug(data.name);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const tontine = await prisma.tontine.create({
      data: {
        name: data.name,
        description: data.description,
        slug,
        amount: data.amount,
        frequency: data.frequency,
        maxMembers: data.maxMembers,
        rotationMode: data.rotationMode,
        isPrivate: data.isPrivate,
        requireGuarantee: data.requireGuarantee,
        guaranteeAmount: data.guaranteeAmount,
        latePenaltyAmount: data.latePenaltyAmount,
        latePenaltyType: data.latePenaltyType,
        maxLatePayments: data.maxLatePayments,
        allowPositionSwap: data.allowPositionSwap,
        creatorId: session.user.id,
        totalCycles: data.maxMembers,
        // Créer automatiquement l'admin comme premier membre
        members: {
          create: {
            userId: session.user.id,
            role: "ADMIN",
            status: "ACTIVE",
            rotationPosition: 1,
            joinedAt: new Date(),
          },
        },
      },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        tontineId: tontine.id,
        action: "CREATE",
        entity: "Tontine",
        entityId: tontine.id,
        after: { name: tontine.name, amount: tontine.amount },
      },
    });

    return NextResponse.json(
      { success: true, data: tontine, message: "Tontine créée avec succès" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[TONTINES_POST]", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
