import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// POST /api/tontines/join — rejoindre via code d'invitation
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const { inviteCode } = await request.json();

    if (!inviteCode?.trim()) {
      return NextResponse.json({ success: false, error: "Code d'invitation requis" }, { status: 400 });
    }

    const tontine = await prisma.tontine.findUnique({
      where: { inviteCode },
      include: {
        members: {
          where: { status: { not: "EXCLUDED" } },
        },
      },
    });

    if (!tontine) {
      return NextResponse.json({ success: false, error: "Code invalide ou expiré" }, { status: 404 });
    }

    // Vérifications métier
    if (tontine.status !== "DRAFT" && tontine.status !== "PENDING") {
      return NextResponse.json(
        { success: false, error: "Cette tontine a déjà démarré, impossible de la rejoindre" },
        { status: 400 }
      );
    }

    if (tontine.members.length >= tontine.maxMembers) {
      return NextResponse.json(
        { success: false, error: "La tontine est complète" },
        { status: 400 }
      );
    }

    // Vérifier si déjà membre
    const existingMember = tontine.members.find((m) => m.userId === session.user.id);
    if (existingMember) {
      return NextResponse.json(
        { success: false, error: "Vous êtes déjà membre de cette tontine" },
        { status: 409 }
      );
    }

    // Ajouter comme membre
    const newPosition = tontine.members.length + 1;
    const member = await prisma.tontineMember.create({
      data: {
        tontineId: tontine.id,
        userId: session.user.id,
        role: "MEMBER",
        status: "ACTIVE",
        rotationPosition: newPosition,
        joinedAt: new Date(),
      },
    });

    // Notification à l'admin
    await prisma.notification.create({
      data: {
        userId: tontine.creatorId,
        tontineId: tontine.id,
        type: "MEMBER_JOINED",
        title: "Nouveau membre",
        message: `Un nouveau membre a rejoint "${tontine.name}"`,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        tontineId: tontine.id,
        action: "JOIN",
        entity: "TontineMember",
        entityId: member.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: { tontineId: tontine.id, memberId: member.id },
      message: `Vous avez rejoint "${tontine.name}" avec succès !`,
    });
  } catch (error) {
    console.error("[TONTINE_JOIN]", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
