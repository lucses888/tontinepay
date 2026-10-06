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
    <div className="space-y-6 max-w-6xl">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Mon Portefeuille</h1>
        <Link
          href="/tontines/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
        >
          <Plus size={16} />
          Nouvelle tontine
        </Link>
      </div>

      {/* Cartes de résumé */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-(--card) rounded-xl border border-(--border) p-4">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div>
              <Wallet size={20} className="text-green-600 mb-2" />
              <h3 className="font-semibold">Total épargné</h3>
            </div>
            <span className="text-xl font-bold text-green-600">{formatCurrency(totalSaved)}</span>
          </div>
          <p className="text-(--muted-foreground) text-sm">
            Épargne accumulée dans toutes vos tontines
          </p>
        </div>

        <div className="bg-(--card) rounded-xl border border-(--border) p-4">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div>
              <TrendingUp size={20} className="text-amber-600 mb-2" />
              <h3 className="font-semibold">À recevoir</h3>
            </div>
            <span className="text-xl font-bold text-amber-600">{formatCurrency(totalToReceive)}</span>
          </div>
          <p className="text-(--muted-foreground) text-sm">
            Montant attendu lors de vos prochains tours
          </p>
        </div>

        <div className="bg-(--card) rounded-xl border border-(--border) p-4">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div>
              <AlertCircle size={20} className="text-red-600 mb-2" />
              <h3 className="font-semibold">Cotisations en attente</h3>
            </div>
            <span className="text-xl font-bold text-red-600">{pendingCount}</span>
          </div>
          <p className="text-(--muted-foreground) text-sm">
            Cotisations à payer pour éviter les pénalités
          </p>
        </div>

        <div className="bg-(--card) rounded-xl border border-(--border) p-4">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div>
              <ArrowRight size={20} className="text-blue-600 mb-2" />
              <h3 className="font-semibold">Score fiabilité</h3>
            </div>
            <span className="text-xl font-bold text-blue-600">{reliability}%</span>
          </div>
          <p className="text-(--muted-foreground) text-sm">
            Indicateur de votre ponctualité dans les paiements
          </p>
        </div>
      </div>

      {/* Historique des transactions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Historique des transactions</h2>

        {transactions.length === 0 ? (
          <div className="bg-(--card) rounded-xl border border-(--border) text-center py-8">
            <p className="text-(--muted-foreground)">Aucune transaction pour le moment</p>
          </div>
        ) : (
          <div className="bg-(--card) rounded-xl border border-(--border) divide-y divide-(--border)">
            {transactions.map((tx) => {
              const isCredit = CREDIT_TYPES.includes(tx.type);
              return (
                <div key={tx.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {tx.description ?? TYPE_LABELS[tx.type] ?? tx.type}
                    </p>
                    <p className="text-xs text-(--muted-foreground)">
                      {TYPE_LABELS[tx.type] ?? tx.type} · {formatDate(tx.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`font-semibold whitespace-nowrap ${
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
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/tontines/new"
            className="bg-(--card) rounded-xl border border-(--border) p-6 text-center flex flex-col items-center justify-center hover:bg-(--muted) transition"
          >
            <Plus size={24} className="mb-3 text-green-600" />
            <h3 className="font-semibold mb-2">Créer une tontine</h3>
            <p className="text-(--muted-foreground) text-sm">
              Démarrez votre propre groupe d&apos;épargne
            </p>
          </Link>

          <Link
            href="/tontines/join"
            className="bg-(--card) rounded-xl border border-(--border) p-6 text-center flex flex-col items-center justify-center hover:bg-(--muted) transition"
          >
            <MapPin size={24} className="mb-3 text-blue-600" />
            <h3 className="font-semibold mb-2">Rejoindre une tontine</h3>
            <p className="text-(--muted-foreground) text-sm">
              Participez à un groupe existant avec un code d&apos;invitation
            </p>
          </Link>

          <Link
            href="/settings"
            className="bg-(--card) rounded-xl border border-(--border) p-6 text-center flex flex-col items-center justify-center hover:bg-(--muted) transition"
          >
            <Settings size={24} className="mb-3 text-purple-600" />
            <h3 className="font-semibold mb-2">Paramètres</h3>
            <p className="text-(--muted-foreground) text-sm">
              Gérez votre profil, notifications et préférences
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
