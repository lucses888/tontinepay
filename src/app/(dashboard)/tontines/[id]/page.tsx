import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatCurrency, formatDate, calculateProgress } from "@/lib/utils";
import { TontineActions } from "@/components/tontine/tontine-actions";
import { MembersTab } from "@/components/tontine/members-tab";
import { CyclesTab } from "@/components/tontine/cycles-tab";
import {
  Users, Calendar, Wallet, Share2, Play, CheckCircle2, Clock,
} from "lucide-react";

export default async function TontineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { id } = await params;
  const userId = session.user.id;

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
              member: { select: { id: true } },
            },
          },
        },
      },
    },
  });

  if (!tontine) notFound();

  // Vérifier l'accès
  const userMember = tontine.members.find((m) => m.userId === userId);
  if (!userMember && tontine.isPrivate) notFound();

  const isAdmin = userMember?.role === "ADMIN" || userMember?.role === "CO_ADMIN";
  const activeCycle = tontine.cycles.find((c) => c.status === "ACTIVE");
  const totalProgress = activeCycle
    ? calculateProgress(activeCycle.collectedAmount, activeCycle.totalAmount)
    : 0;

  // Trouver le bénéficiaire du cycle actif
  const beneficiary = activeCycle
    ? tontine.members.find((m) => m.userId === activeCycle.beneficiaryId)
    : null;

  // Vérifier si l'utilisateur a payé ce cycle
  const userContrib = activeCycle?.contributions.find(
    (c) => c.userId === userId
  );

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="bg-(--card) rounded-xl border border-(--border) p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={tontine.status} />
              {isAdmin && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  Administrateur
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold">{tontine.name}</h2>
            {tontine.description && (
              <p className="text-(--muted-foreground) mt-1 text-sm">{tontine.description}</p>
            )}
          </div>

          {/* Actions */}
          <TontineActions
            tontine={{
              id: tontine.id,
              status: tontine.status,
              inviteCode: tontine.inviteCode,
              memberCount: tontine.members.length,
            }}
            isAdmin={isAdmin}
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-(--border)">
          <Stat
            icon={<Wallet size={18} className="text-green-600" />}
            label="Cotisation"
            value={formatCurrency(tontine.amount)}
          />
          <Stat
            icon={<Calendar size={18} className="text-blue-600" />}
            label="Fréquence"
            value={FREQ_LABELS[tontine.frequency]}
          />
          <Stat
            icon={<Users size={18} className="text-purple-600" />}
            label="Membres"
            value={`${tontine.members.length}/${tontine.maxMembers}`}
          />
          <Stat
            icon={<CheckCircle2 size={18} className="text-amber-600" />}
            label="Cycle"
            value={
              tontine.status === "ACTIVE"
                ? `${tontine.currentCycle}/${tontine.totalCycles}`
                : tontine.status === "COMPLETED"
                ? "Terminé"
                : "—"
            }
          />
        </div>
      </div>

      {/* Active Cycle Banner */}
      {activeCycle && (
        <div
          className={`rounded-xl border p-5 ${
            userContrib?.status === "PAID"
              ? "bg-green-50 border-green-200"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock
                  size={16}
                  className={
                    userContrib?.status === "PAID"
                      ? "text-green-600"
                      : "text-amber-600"
                  }
                />
                <span className="font-semibold text-sm">
                  Cycle {activeCycle.cycleNumber} en cours
                </span>
              </div>
              <p className="text-sm text-(--muted-foreground)">
                Bénéficiaire :{" "}
                <strong>
                  {beneficiary?.user.name ??
                    (beneficiary?.userId === userId ? "Vous" : "—")}
                </strong>{" "}
                · Échéance : <strong>{formatDate(activeCycle.dueDate)}</strong>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xl font-bold">
                  {formatCurrency(activeCycle.collectedAmount)}
                </p>
                <p className="text-xs text-(--muted-foreground)">
                  / {formatCurrency(activeCycle.totalAmount)} collectés
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-14 h-14 relative">
                  {/* Circular progress */}
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9"
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="3"
                      strokeDasharray={`${totalProgress} ${100 - totalProgress}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                    {totalProgress}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* My payment status */}
          {userMember && (
            <div className="mt-3 pt-3 border-t border-white/50 flex items-center justify-between">
              <span className="text-sm">
                Mon statut :{" "}
                <strong
                  className={
                    userContrib?.status === "PAID"
                      ? "text-green-700"
                      : "text-amber-700"
                  }
                >
                  {userContrib?.status === "PAID"
                    ? "✓ Cotisation payée"
                    : "En attente de paiement"}
                </strong>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tabs — Members & Cycles */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MembersTab
          members={tontine.members}
          activeCycleContributions={activeCycle?.contributions ?? []}
          isAdmin={isAdmin}
          currentUserId={userId}
        />

        <CyclesTab
          cycles={tontine.cycles}
          members={tontine.members}
          tontineId={tontine.id}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const FREQ_LABELS: Record<string, string> = {
  WEEKLY: "Hebdomadaire",
  BIWEEKLY: "Bimensuelle",
  MONTHLY: "Mensuelle",
};

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-(--muted) flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-(--muted-foreground)">{label}</p>
        <p className="font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const CONFIG: Record<string, { label: string; className: string }> = {
    DRAFT: { label: "Brouillon", className: "bg-gray-100 text-gray-600" },
    PENDING: { label: "En attente", className: "bg-amber-100 text-amber-700" },
    ACTIVE: { label: "Active", className: "bg-green-100 text-green-700" },
    COMPLETED: { label: "Terminée", className: "bg-blue-100 text-blue-700" },
    DISSOLVED: { label: "Dissoute", className: "bg-red-100 text-red-700" },
  };
  const cfg = CONFIG[status] ?? { label: status, className: "" };
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
