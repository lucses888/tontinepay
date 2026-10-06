import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatCurrency, formatDate, calculateProgress } from "@/lib/utils";
import {
  ArrowRight, TrendingUp, Users, Wallet, AlertCircle, Plus
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
    <div className="space-y-6 max-w-6xl">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold">
          Bonjour, {user?.name?.split(" ")[0]} 👋
        </h2>
        <p className="text-(--muted-foreground) mt-1">
          Voici un aperçu de vos tontines
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total épargné"
          value={formatCurrency(totalSaved)}
          icon={<TrendingUp size={20} className="text-green-600" />}
          bgColor="bg-green-50"
        />
        <KpiCard
          label="Tontines actives"
          value={String(activeTontineCount)}
          icon={<Users size={20} className="text-blue-600" />}
          bgColor="bg-blue-50"
        />
        <KpiCard
          label="Cotisations en attente"
          value={String(pendingContributions)}
          icon={<AlertCircle size={20} className="text-amber-600" />}
          bgColor="bg-amber-50"
          highlight={pendingContributions > 0}
        />
        <KpiCard
          label="Score fiabilité"
          value={`${user?.reliabilityScore ?? 100}%`}
          icon={<Wallet size={20} className="text-purple-600" />}
          bgColor="bg-purple-50"
        />
      </div>

      {/* Active Tontines */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Tontines actives</h3>
          <Link
            href="/tontines"
            className="flex items-center gap-1 text-sm text-green-600 hover:underline"
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
                  className="block bg-(--card) rounded-xl border border-(--border) p-5 card-hover"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold truncate max-w-[160px]">{t.name}</h4>
                      <p className="text-sm text-(--muted-foreground)">
                        Cycle {t.currentCycle}/{t.totalCycles}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        hasPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {hasPaid ? "✓ Payé" : "En attente"}
                    </span>
                  </div>

                  <p className="text-2xl font-bold text-green-600 mb-3">
                    {formatCurrency(t.amount)}
                    <span className="text-sm text-(--muted-foreground) font-normal"> / cycle</span>
                  </p>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs text-(--muted-foreground) mb-1">
                      <span>Collecte</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-(--muted) rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-(--muted-foreground)">
                        {formatCurrency(activeCycle?.collectedAmount ?? 0)} collectés
                      </span>
                      <span className="text-(--muted-foreground)">
                        {t.members.length} membres
                      </span>
                    </div>
                  </div>

                  {activeCycle && (
                    <p className="text-xs text-(--muted-foreground) mt-2">
                      Échéance : {formatDate(activeCycle.dueDate)}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-4">Transactions récentes</h3>
          <div className="bg-(--card) rounded-xl border border-(--border) divide-y divide-(--border)">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{tx.description ?? tx.type}</p>
                  <p className="text-xs text-(--muted-foreground)">
                    {formatDate(tx.createdAt)}
                  </p>
                </div>
                <span
                  className={`font-semibold text-sm ${
                    tx.type === "DISBURSEMENT"
                      ? "text-green-600"
                      : "text-(--foreground)"
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
  bgColor,
  highlight,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-(--card) rounded-xl border p-4 ${
        highlight ? "border-amber-300" : "border-(--border)"
      }`}
    >
      <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-(--muted-foreground) mt-0.5">{label}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-(--card) rounded-xl border border-(--border) border-dashed p-12 text-center">
      <div className="text-5xl mb-4">🤝</div>
      <h3 className="font-semibold text-lg mb-2">Aucune tontine active</h3>
      <p className="text-(--muted-foreground) text-sm mb-6">
        Créez votre première tontine ou rejoignez un groupe existant
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/tontines/new"
          className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition"
        >
          <Plus size={16} />
          Créer une tontine
        </Link>
        <Link
          href="/tontines/join"
          className="flex items-center gap-2 border border-(--border) px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-(--muted) transition"
        >
          Rejoindre avec un code
        </Link>
      </div>
    </div>
  );
}
