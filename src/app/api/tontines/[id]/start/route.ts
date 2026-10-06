import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { calculateDueDate } from "@/lib/utils";

// POST /api/tontines/[id]/start — démarrer une tontine (admin)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    // Vérifier admin
    const member = await prisma.tontineMember.findFirst({
      where: { tontineId: id, userId: session.user.id, role: { in: ["ADMIN", "CO_ADMIN"] } },
    });

    if (!member) {
      return NextResponse.json({ success: false, error: "Réservé à l'administrateur" }, { status: 403 });
    }

    const tontine = await prisma.tontine.findUnique({
      where: { id },
      include: {
        members: {
          where: { status: { not: "EXCLUDED" } },
          orderBy: { rotationPosition: "asc" },
        },
      },
    });

    if (!tontine) {
      return NextResponse.json({ success: false, error: "Tontine introuvable" }, { status: 404 });
    }

    if (tontine.status !== "DRAFT" && tontine.status !== "PENDING") {
      return NextResponse.json(
        { success: false, error: "La tontine a déjà démarré" },
        { status: 400 }
      );
    }

    if (tontine.members.length < 2) {
      return NextResponse.json(
        { success: false, error: "Il faut au moins 2 membres pour démarrer" },
        { status: 400 }
      );
    }

    const startDate = new Date();
    const dueDate = calculateDueDate(startDate, tontine.frequency);
    const totalAmount = tontine.amount * tontine.members.length;
    const commissionAmount = Math.round(totalAmount * tontine.commissionRate);
    const netAmount = totalAmount - commissionAmount;

    // Créer tous les cycles + activer le premier
    await prisma.$transaction(async (tx) => {
      // Créer tous les cycles
      for (let i = 0; i < tontine.members.length; i++) {
        const member = tontine.members[i];
        const cycleStart = new Date(startDate);
        const cycleDue = new Date(dueDate);

        // Décaler les dates pour les cycles suivants
        if (i > 0) {
          if (tontine.frequency === "WEEKLY") {
            cycleStart.setDate(cycleStart.getDate() + 7 * i);
            cycleDue.setDate(cycleDue.getDate() + 7 * i);
          } else if (tontine.frequency === "BIWEEKLY") {
            cycleStart.setDate(cycleStart.getDate() + 14 * i);
            cycleDue.setDate(cycleDue.getDate() + 14 * i);
          } else {
            cycleStart.setMonth(cycleStart.getMonth() + i);
            cycleDue.setMonth(cycleDue.getMonth() + i);
          }
        }

        await tx.cycle.create({
          data: {
            tontineId: id,
            cycleNumber: i + 1,
            beneficiaryId: member.userId,
            totalAmount: netAmount,
            collectedAmount: 0,
            commissionAmount,
            startDate: cycleStart,
            dueDate: cycleDue,
            status: i === 0 ? "ACTIVE" : "UPCOMING",
          },
        });
      }

      // Mettre à jour la tontine
      await tx.tontine.update({
        where: { id },
        data: {
          status: "ACTIVE",
          currentCycle: 1,
          totalCycles: tontine.members.length,
          startDate,
          endDate: calculateDueDate(
            startDate,
            tontine.frequency
          ),
        },
      });

      // Notifier tous les membres
      const notifications = tontine.members.map((m) => ({
        userId: m.userId,
        tontineId: id,
        type: "TONTINE_STARTED" as const,
        title: "🚀 Tontine démarrée !",
        message: `La tontine "${tontine.name}" vient de démarrer. Le premier bénéficiaire est ${tontine.members[0].userId === m.userId ? "vous" : "un autre membre"}.`,
      }));

      await tx.notification.createMany({ data: notifications });

      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          tontineId: id,
          action: "START",
          entity: "Tontine",
          entityId: id,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: `La tontine "${tontine.name}" est maintenant active !`,
    });
  } catch (error) {
    console.error("[TONTINE_START]", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
