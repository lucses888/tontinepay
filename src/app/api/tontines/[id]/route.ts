import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { calculateProgress } from "@/lib/utils";

// GET /api/tontines/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    const tontine = await prisma.tontine.findUnique({
      where: { id },
      include: {
        members: {
          where: { status: { not: "EXCLUDED" } },
          orderBy: { rotationPosition: "asc" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                phone: true,
                reliabilityScore: true,
                kycStatus: true,
              },
            },
          },
        },
        cycles: {
          orderBy: { cycleNumber: "asc" },
          include: {
            contributions: {
              include: {
                user: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });

    if (!tontine) {
      return NextResponse.json({ success: false, error: "Tontine introuvable" }, { status: 404 });
    }

    // Vérifier l'accès
    const userMember = tontine.members.find((m) => m.userId === session.user.id);
    if (!userMember && tontine.isPrivate) {
      return NextResponse.json({ success: false, error: "Accès refusé" }, { status: 403 });
    }

    const cyclesSummary = tontine.cycles.map((c) => ({
      id: c.id,
      cycleNumber: c.cycleNumber,
      beneficiaryId: c.beneficiaryId,
      beneficiaryName: tontine.members.find((m) => m.userId === c.beneficiaryId)?.user?.name ?? null,
      totalAmount: c.totalAmount,
      collectedAmount: c.collectedAmount,
      startDate: c.startDate,
      dueDate: c.dueDate,
      disbursementDate: c.disbursementDate,
      status: c.status,
      progress: calculateProgress(c.collectedAmount, c.totalAmount),
    }));

    const activeCycle = tontine.cycles.find((c) => c.status === "ACTIVE");

    return NextResponse.json({
      success: true,
      data: {
        ...tontine,
        cycles: cyclesSummary,
        isAdmin: userMember?.role === "ADMIN" || userMember?.role === "CO_ADMIN",
        userMember,
        memberCount: tontine.members.length,
        collectedThisCycle: activeCycle?.collectedAmount ?? 0,
        nextDueDate: activeCycle?.dueDate ?? null,
      },
    });
  } catch (error) {
    console.error("[TONTINE_GET]", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/tontines/[id] — mettre à jour une tontine (admin seulement)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Vérifier que l'utilisateur est admin
    const member = await prisma.tontineMember.findFirst({
      where: { tontineId: id, userId: session.user.id, role: { in: ["ADMIN", "CO_ADMIN"] } },
    });

    if (!member) {
      return NextResponse.json({ success: false, error: "Action réservée à l'administrateur" }, { status: 403 });
    }

    const tontine = await prisma.tontine.findUnique({ where: { id } });
    if (!tontine) {
      return NextResponse.json({ success: false, error: "Tontine introuvable" }, { status: 404 });
    }

    // Ne peut pas modifier certains champs si la tontine est active
    if (tontine.status === "ACTIVE") {
      const { amount, frequency, maxMembers, ...safeUpdates } = body;
      const updated = await prisma.tontine.update({
        where: { id },
        data: safeUpdates,
      });
      return NextResponse.json({ success: true, data: updated });
    }

    const updated = await prisma.tontine.update({ where: { id }, data: body });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[TONTINE_PATCH]", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/tontines/[id] — dissoudre une tontine (admin seulement)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    const member = await prisma.tontineMember.findFirst({
      where: { tontineId: id, userId: session.user.id, role: "ADMIN" },
    });

    if (!member) {
      return NextResponse.json({ success: false, error: "Réservé à l'administrateur" }, { status: 403 });
    }

    await prisma.tontine.update({
      where: { id },
      data: { status: "DISSOLVED" },
    });

    return NextResponse.json({ success: true, message: "Tontine dissoute" });
  } catch (error) {
    console.error("[TONTINE_DELETE]", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
