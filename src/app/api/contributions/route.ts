import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { recordContributionSchema } from "@/lib/validations/auth";
import { calculateCommission } from "@/lib/utils";

// POST /api/contributions — enregistrer une cotisation
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = recordContributionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { cycleId, memberId, amount, paymentMethod, transactionRef } = parsed.data;

    // Charger le cycle et la tontine
    const cycle = await prisma.cycle.findUnique({
      where: { id: cycleId },
      include: {
        tontine: {
          include: {
            members: { where: { role: { in: ["ADMIN", "CO_ADMIN"] } } },
          },
        },
      },
    });

    if (!cycle) {
      return NextResponse.json({ success: false, error: "Cycle introuvable" }, { status: 404 });
    }

    if (cycle.status !== "ACTIVE") {
      return NextResponse.json({ success: false, error: "Ce cycle n'est pas actif" }, { status: 400 });
    }

    // Vérifier que l'enregistreur est admin ou le membre lui-même
    const adminIds = cycle.tontine.members.map((m) => m.userId);
    const member = await prisma.tontineMember.findUnique({ where: { id: memberId } });
    const isAdmin = adminIds.includes(session.user.id);
    const isSelf = member?.userId === session.user.id;

    if (!isAdmin && !isSelf) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
    }

    // Vérifier si déjà payé
    const existing = await prisma.contribution.findFirst({
      where: {
        cycleId,
        memberId,
        status: { in: ["PAID", "EXCUSED"] },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Cette cotisation a déjà été enregistrée" },
        { status: 409 }
      );
    }

    // Calculer pénalité si en retard
    const now = new Date();
    const isLate = now > cycle.dueDate;
    const penaltyAmount = isLate
      ? cycle.tontine.latePenaltyType === "PERCENTAGE"
        ? Math.round(amount * (cycle.tontine.latePenaltyAmount / 100))
        : cycle.tontine.latePenaltyAmount
      : 0;

    // Créer la contribution et mettre à jour le cycle dans une transaction
    const [contribution] = await prisma.$transaction(async (tx) => {
      const contrib = await tx.contribution.upsert({
        where: {
          id: (await tx.contribution.findFirst({ where: { cycleId, memberId } }))?.id ?? "new",
        },
        create: {
          cycleId,
          memberId,
          userId: member!.userId,
          amount,
          penaltyAmount,
          status: "PAID",
          paymentMethod,
          transactionRef,
          paidAt: now,
          dueDate: cycle.dueDate,
        },
        update: {
          amount,
          penaltyAmount,
          status: "PAID",
          paymentMethod,
          transactionRef,
          paidAt: now,
        },
      });

      // Mettre à jour le montant collecté du cycle
      const newCollected = cycle.collectedAmount + amount;
      await tx.cycle.update({
        where: { id: cycleId },
        data: {
          collectedAmount: newCollected,
          // Si 100% collecté, marquer comme complété
          ...(newCollected >= cycle.totalAmount ? { status: "COMPLETED" } : {}),
        },
      });

      // Si en retard, incrémenter le compteur
      if (isLate) {
        await tx.tontineMember.update({
          where: { id: memberId },
          data: { latePayments: { increment: 1 } },
        });
      }

      // Enregistrer la transaction financière
      const commission = calculateCommission(amount, cycle.tontine.commissionRate);
      await tx.transaction.create({
        data: {
          userId: member!.userId,
          tontineId: cycle.tontineId,
          type: "CONTRIBUTION",
          amount,
          paymentMethod,
          reference: transactionRef,
          status: "SUCCESS",
          description: `Cotisation cycle ${cycle.cycleNumber} - ${cycle.tontine.name}`,
        },
      });

      return [contrib];
    });

    // Notification au membre
    await prisma.notification.create({
      data: {
        userId: member!.userId,
        tontineId: cycle.tontineId,
        type: "CONTRIBUTION_PAID",
        title: "Cotisation enregistrée ✓",
        message: `Votre cotisation de ${amount} XOF pour le cycle ${cycle.cycleNumber} a été enregistrée.`,
      },
    });

    return NextResponse.json({
      success: true,
      data: contribution,
      message: "Cotisation enregistrée avec succès",
    });
  } catch (error) {
    console.error("[CONTRIBUTIONS_POST]", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
