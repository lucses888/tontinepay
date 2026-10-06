import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowRight,
  TrendingUp,
  Wallet,
  AlertCircle,
  Plus,
  MapPin,
  Settings,
  type LucideIcon,
} from "lucide-react";

// Types de transactions qui créditent le portefeuille de l'utilisateur
const CREDIT_TYPES = ["DISBURSEMENT", "REFUND", "GUARANTEE_OUT"];

const TYPE_LABELS: Record<string, string> = {
  CONTRIBUTION: "Cotisation",
  DISBURSEMENT: "Versement reçu",
  PENALTY: "Pénalité",
  COMMISSION: "Commission",
  GUARANTEE_IN: "Dépôt de caution",
  GUARANTEE_OUT: "Remboursement de caution",
  REFUND: "Remboursement",
};

function SummaryCard({
  icon: Icon,
  iconClass,
  valueClass,
  title,
  value,
  description,
}: {
  icon: LucideIcon;
  iconClass: string;
  valueClass: string;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="min-w-0 bg-(--card) rounded-xl border border-(--border) p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={18} className={`shrink-0 ${iconClass}`} />
        <h3 className="text-sm font-semibold leading-tight">{title}</h3>
      </div>
      <p className={`text-lg sm:text-xl lg:text-2xl font-bold break-words ${valueClass}`}>
        {value}
      </p>
      <p className="mt-1 text-xs sm:text-sm text-(--muted-foreground)">{description}</p>
    </div>
  );
}

export default async function WalletPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [user, transactions, pendingCount, upcomingPayouts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { totalSaved: true, reliabilityScore: true },
    }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.contribution.count({
      where: { userId, status: "PENDING" },
    }),
    // Cycles à venir dont l'utilisateur est le bénéficiaire
    prisma.cycle.findMany({
      where: {
        beneficiaryId: userId,
        status: { in: ["ACTIVE", "UPCOMING"] },
        tontine: { status: "ACTIVE" },
      },
      select: { totalAmount: true },
    }),
  ]);

  const totalSaved = user?.totalSaved ?? 0;
  const totalToReceive = upcomingPayouts.reduce((sum, c) => sum + c.totalAmount, 0);
  const reliability = Math.round(user?.reliabilityScore ?? 100);

  return (
    <div className="space-y-6 max-w-6xl w-full min-w-0">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">Mon Portefeuille</h1>
        <Link
          href="/tontines/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
        >
          <Plus size={16} />
          Nouvelle tontine
        </Link>
      </div>

      {/* Cartes de résumé */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SummaryCard
          icon={Wallet}
          iconClass="text-green-600"
          valueClass="text-green-600"
          title="Total épargné"
          value={formatCurrency(totalSaved)}
          description="Épargne accumulée dans vos tontines"
        />
        <SummaryCard
          icon={TrendingUp}
          iconClass="text-amber-600"
          valueClass="text-amber-600"
          title="À recevoir"
          value={formatCurrency(totalToReceive)}
          description="Attendu lors de vos prochains tours"
        />
        <SummaryCard
          icon={AlertCircle}
          iconClass="text-red-600"
          valueClass="text-red-600"
          title="Cotisations en attente"
          value={String(pendingCount)}
          description="À payer pour éviter les pénalités"
        />
        <SummaryCard
          icon={ArrowRight}
          iconClass="text-blue-600"
          valueClass="text-blue-600"
          title="Score fiabilité"
          value={`${reliability}%`}
          description="Votre ponctualité dans les paiements"
        />
      </div>

      {/* Historique des transactions */}
      <section>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Historique des transactions</h2>

        {transactions.length === 0 ? (
          <div className="bg-(--card) rounded-xl border border-(--border) text-center py-8">
            <p className="text-(--muted-foreground)">Aucune transaction pour le moment</p>
          </div>
        ) : (
          <div className="bg-(--card) rounded-xl border border-(--border) divide-y divide-(--border)">
            {transactions.map((tx) => {
              const isCredit = CREDIT_TYPES.includes(tx.type);
              return (
                <div key={tx.id} className="flex items-center justify-between gap-3 p-3 sm:p-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {tx.description ?? TYPE_LABELS[tx.type] ?? tx.type}
                    </p>
                    <p className="text-xs text-(--muted-foreground) truncate">
                      {TYPE_LABELS[tx.type] ?? tx.type} · {formatDate(tx.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-sm sm:text-base font-semibold whitespace-nowrap ${
                      isCredit ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isCredit ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Actions rapides */}
      <section>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Actions rapides</h2>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
          <Link
            href="/tontines/new"
            className="bg-(--card) rounded-xl border border-(--border) p-4 sm:p-6 text-center flex flex-col items-center justify-center hover:bg-(--muted) transition"
          >
            <Plus size={24} className="mb-3 text-green-600" />
            <h3 className="font-semibold mb-1">Créer une tontine</h3>
            <p className="text-(--muted-foreground) text-sm">
              Démarrez votre propre groupe d&apos;épargne
            </p>
          </Link>

          <Link
            href="/tontines/join"
            className="bg-(--card) rounded-xl border border-(--border) p-4 sm:p-6 text-center flex flex-col items-center justify-center hover:bg-(--muted) transition"
          >
            <MapPin size={24} className="mb-3 text-blue-600" />
            <h3 className="font-semibold mb-1">Rejoindre une tontine</h3>
            <p className="text-(--muted-foreground) text-sm">
              Participez à un groupe avec un code d&apos;invitation
            </p>
          </Link>

          <Link
            href="/settings"
            className="bg-(--card) rounded-xl border border-(--border) p-4 sm:p-6 text-center flex flex-col items-center justify-center hover:bg-(--muted) transition"
          >
            <Settings size={24} className="mb-3 text-purple-600" />
            <h3 className="font-semibold mb-1">Paramètres</h3>
            <p className="text-(--muted-foreground) text-sm">
              Gérez votre profil et vos préférences
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
