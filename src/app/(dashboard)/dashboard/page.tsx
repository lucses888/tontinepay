import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatCurrency, formatDate, calculateProgress } from "@/lib/utils";
import {
  ArrowRight, TrendingUp, Users, Wallet, AlertCircle, Plus, Compass, Handshake,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  // Données parallèles
  const [user, activeTontines, pendingContributions, recentTransactions] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, totalSaved: true, reliabilityScore: true },
      }),
      prisma.tontine.findMany({
        where: {
          status: "ACTIVE",
          members: { some: { userId, status: "ACTIVE" } },
        },
        include: {
          members: { where: { status: { not: "EXCLUDED" } } },
          cycles: {
            where: { status: "ACTIVE" },
            take: 1,
            include: {
              contributions: { where: { userId } },
            },
          },
        },
        take: 5,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.contribution.count({
        where: { userId, status: "PENDING" },
      }),
      prisma.transaction.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const totalSaved = user?.totalSaved ?? 0;
  const activeTontineCount = activeTontines.length;

  return (
    <div className="max-w-6xl space-y-8">
      {/* Greeting */}
      <div>
        <h2 className="page-title text-2xl sm:text-3xl">
          Bonjour, {user?.name?.split(" ")[0]} 👋
        </h2>
        <p className="mt-1 text-(--muted-foreground)">
          Voici un aperçu de vos tontines
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Total épargné"
          value={formatCurrency(totalSaved)}
          icon={<TrendingUp size={20} className="text-brand" />}
          iconBg="bg-brand-soft"
        />
        <KpiCard
          label="Tontines actives"
          value={String(activeTontineCount)}
          icon={<Users size={20} className="text-info" />}
          iconBg="bg-info-soft"
        />
        <KpiCard
          label="Cotisations en attente"
          value={String(pendingContributions)}
          icon={<AlertCircle size={20} className="text-warning" />}
          iconBg="bg-warning-soft"
          highlight={pendingContributions > 0}
        />
        <KpiCard
          label="Score fiabilité"
          value={`${user?.reliabilityScore ?? 100}%`}
          icon={<Wallet size={20} className="text-[#7c5cbf]" />}
          iconBg="bg-[#f0eafc]"
        />
      </div>

      {/* Tontines actives */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">Tontines actives</h3>
          <Link
            href="/tontines"
            className="flex items-center gap-1 text-sm font-medium text-brand hover:underline"
          >
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>

        {activeTontines.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {activeTontines.map((t) => {
              const activeCycle = t.cycles[0];
              const userContrib = activeCycle?.contributions[0];
              const progress = activeCycle
                ? calculateProgress(activeCycle.collectedAmount, activeCycle.totalAmount)
                : 0;
              const hasPaid = userContrib?.status === "PAID";

              return (
                <Link
                  key={t.id}
                  href={`/tontines/${t.id}`}
                  className="card-hover block rounded-xl border border-(--border) bg-white p-5"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h4 className="max-w-[160px] truncate font-semibold">{t.name}</h4>
                      <p className="text-sm text-(--muted-foreground)">
                        Cycle {t.currentCycle}/{t.totalCycles}
                      </p>
                    </div>
                    <span className={`badge ${hasPaid ? "badge-green" : "badge-amber"}`}>
                      {hasPaid ? "Payé" : "En attente"}
                    </span>
                  </div>

                  <p className="mb-3 font-display text-2xl font-bold text-brand">
                    {formatCurrency(t.amount)}
                    <span className="text-sm font-normal text-(--muted-foreground)"> / cycle</span>
                  </p>

                  {/* Barre de progression */}
                  <div>
                    <div className="mb-1 flex justify-between text-xs text-(--muted-foreground)">
                      <span>Collecte</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-(--muted)">
                      <div
                        className="h-full rounded-full bg-brand transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-xs">
                      <span className="text-(--muted-foreground)">
                        {formatCurrency(activeCycle?.collectedAmount ?? 0)} collectés
                      </span>
                      <span className="text-(--muted-foreground)">
                        {t.members.length} membres
                      </span>
                    </div>
                  </div>

                  {activeCycle && (
                    <p className="mt-2 text-xs text-(--muted-foreground)">
                      Échéance : {formatDate(activeCycle.dueDate)}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Transactions récentes */}
      {recentTransactions.length > 0 && (
        <section>
          <h3 className="mb-4 font-display text-lg font-bold">Transactions récentes</h3>
          <div className="divide-y divide-(--border) rounded-xl border border-(--border) bg-white">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{tx.description ?? tx.type}</p>
                  <p className="text-xs text-(--muted-foreground)">
                    {formatDate(tx.createdAt)}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    tx.type === "DISBURSEMENT" ? "text-brand" : "text-(--foreground)"
                  }`}
                >
                  {tx.type === "DISBURSEMENT" ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  icon,
  iconBg,
  highlight,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border bg-white p-4 ${
        highlight ? "border-[#f3dfa5] bg-warning-soft/40" : "border-(--border)"
      }`}
    >
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
        {icon}
      </div>
      <p className="font-display text-2xl font-bold">{value}</p>
      <p className="mt-0.5 text-sm text-(--muted-foreground)">{label}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-(--border) bg-white p-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft">
        <Handshake size={26} className="text-brand" />
      </div>
      <h3 className="mb-2 font-display text-lg font-bold">Aucune tontine active</h3>
      <p className="mb-6 text-sm text-(--muted-foreground)">
        Créez votre première tontine ou rejoignez un groupe existant
      </p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/tontines/new" className="btn-primary">
          <Plus size={16} />
          Créer une tontine
        </Link>
        <Link href="/tontines/join" className="btn-secondary">
          <Compass size={16} />
          Rejoindre avec un code
        </Link>
      </div>
    </div>
  );
}
