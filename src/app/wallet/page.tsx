import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowRight,
  TrendingUp,
  Wallet,
  AlertCircle,
  Plus,
  Loader2,
} from "lucide-react";

export default async function WalletPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  // Données parallèles
  const [user, transactions, pendingContributions, activeTontines] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, totalSaved: true, reliabilityScore: true },
      }),
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.contribution.count({
        where: { userId, status: "PENDING" },
      }),
      prisma.tontine.findMany({
        where: {
          members: { some: { userId, status: { not: "EXCLUDED" } } },
          status: "ACTIVE",
        },
        select: {
          id: true,
          name: true,
          amount: true,
          cycles: {
            where: { status: "ACTIVE" },
            take: 1,
            select: {
              collectedAmount: true,
              totalAmount: true,
            },
          },
        },
      }),
    ]);

  const totalSaved = user?.totalSaved ?? 0;
  const pendingCount = pendingContributions;

  // Calculer le total à recevoir (sommes des cycles actifs où l'utilisateur devrait recevoir)
  let totalToReceive = 0;
  activeTontines.forEach(tontine => {
    const activeCycle = tontine.cycles[0];
    if (activeCycle) {
      const progress = activeCycle.collectedAmount / activeCycle.totalAmount;
      // Si la collecte est complète, l'utilisateur devrait recevoir bientôt
      if (progress >= 0.95) { // 95% collecté
        totalToReceive += tontine.amount;
      }
    }
  });

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
          <div className="flex items-center justify-between mb-3">
            <div>
              <Wallet size={20} className="text-green-600 mb-2" />
              <h3 className="font-semibold">Total épargné</h3>
            </div>
            <span className="text-2xl font-bold text-green-600">{formatCurrency(totalSaved)}</span>
          </div>
          <p className="text-(--muted-foreground) text-sm">
            Épargne accumulée dans toutes vos tontines
          </p>
        </div>

        <div className="bg-(--card) rounded-xl border border-(--border) p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <TrendingUp size={20} className="text-amber-600 mb-2" />
              <h3 className="font-semibold">À recevoir bientôt</h3>
            </div>
            <span className="text-2xl font-bold text-amber-600">{formatCurrency(totalToReceive)}</span>
          </div>
          <p className="text-(--muted-foreground) text-sm">
            Montant attendu dans les prochains cycles
          </p>
        </div>

        <div className="bg-(--card) rounded-xl border border-(--border) p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <AlertCircle size={20} className="text-red-600 mb-2" />
              <h3 className="font-semibold">Cotisations en attente</h3>
            </div>
            <span className="text-2xl font-bold text-red-600">{pendingCount}</span>
          </div>
          <p className="text-(--muted-foreground) text-sm">
            Cotisations à payer pour éviter les pénalités
          </p>
        </div>

        <div className="bg-(--card) rounded-xl border border-(--border) p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <ArrowRight size={20} className="text-blue-600 mb-2" />
              <h3 className="font-semibold">Score fiabilité</h3>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {user?.reliabilityScore ?? 100}%
            </span>
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
          <div className="text-center py-8">
            <p className="text-(--muted-foreground)">Aucune transaction trouvée</p>
          </div>
        ) : (
          <div className="bg-(--card) rounded-xl border border-(--border) divide-y divide-(--border)">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">{tx.description ?? tx.type}</p>
                  <p className="text-xs text-(--muted-foreground)">
                    {formatDate(tx.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      tx.type === "DISBURSEMENT"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {tx.type === "DISBURSEMENT" ? "+" : "-"}
                  </span>
                  <span className="font-semibold text-lg">
                    {tx.type === "DISBURSEMENT" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              </div>
            ))}
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
              Démarrez votre propre groupe d'épargne
            </p>
          </Link>

          <Link
            href="/tontines/join"
            className="bg-(--card) rounded-xl border border-(--border) p-6 text-center flex flex-col items-center justify-center hover:bg-(--muted) transition"
          >
            <MapPin size={24} className="mb-3 text-blue-600" />
            <h3 className="font-semibold mb-2">Rejoindre une tontine</h3>
            <p className="text-(--muted-foreground) text-sm">
              Participerez à un groupe existant avec un code d'invitation
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

// Import MapPin and Settings at the top
import { MapPin, Settings } from "lucide-react";