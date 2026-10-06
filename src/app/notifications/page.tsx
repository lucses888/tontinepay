import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Bell,
  CheckCircle2,
  Loader2,
  TrendingUp,
  Users,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { BackButton, MarkAllReadButton } from "./notification-actions";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  const [user, recentContributions, recentTontines, recentDisbursements] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, totalSaved: true, reliabilityScore: true },
    }),
    // Cotisations payées (7 derniers jours)
    prisma.contribution.findMany({
      where: { userId, status: "PAID", createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      select: { id: true, createdAt: true, amount: true },
    }),
    // Tontines rejointes (30 derniers jours)
    prisma.tontineMember.findMany({
      where: { userId, joinedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      select: { id: true, joinedAt: true, tontine: { select: { id: true, name: true, amount: true } } },
    }),
    // Versements reçus
    prisma.transaction.findMany({
      where: { userId, type: "DISBURSEMENT" },
      select: { id: true, createdAt: true, amount: true },
    }),
  ]);

  // Fusionner les activités récentes dans un format commun pour l'affichage
  const recentActivities: Array<{
    type: string;
    id: string;
    createdAt: Date;
    title: string;
    message: string;
    amount: number;
  }> = [
    ...recentContributions.map((c) => ({
      type: "contribution",
      id: c.id,
      createdAt: c.createdAt,
      title: "Cotisation reçue",
      message: `Votre cotisation a été reçue`,
      amount: c.amount,
    })),
    ...recentTontines.map((tm) => ({
      type: "tontine",
      id: tm.id,
      createdAt: tm.joinedAt ?? new Date(),
      title: "Nouvelle tontine",
      message: `Vous avez rejoint la tontine "${tm.tontine.name}"`,
      amount: tm.tontine.amount,
    })),
    ...recentDisbursements.map((d) => ({
      type: "disbursement",
      id: d.id,
      createdAt: d.createdAt,
      title: "Versement reçu",
      message: `Vous avez reçu un versement de votre tontine`,
      amount: d.amount,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 20);

  // Simuler le comptage des non lus (dans une vraie app, cela viendrait d'une table de notifications avec un champ lu)
  const simulatedUnreadCount = Math.min(recentActivities.length, 3); // Simuler 3 non lus

  return (
    <div className="space-y-6 max-w-4xl">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold">Notifications</h1>
        {simulatedUnreadCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
              {simulatedUnreadCount}
            </div>
            <span className="text-sm font-medium text-green-600">
              {simulatedUnreadCount} nouvelles
            </span>
          </div>
        )}
      </div>

      {/* Paramètres de notification */}
      <div className="bg-(--card) rounded-xl border border-(--border) p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Paramètres de notification</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <Bell size={20} className="mt-0.5 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Notifications d'activité</h3>
                <p className="text-(--muted-foreground) text-sm">
                  Recevez des alertes pour les cotisations reçues, les versements et les activités de groupe
                </p>
              </div>
            </div>
            {/* À implémenter : un switch pour activer/désactiver */}
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-1">
              <Wallet size={20} className="mt-0.5 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Notifications financières</h3>
                <p className="text-(--muted-foreground) text-sm">
                  Soyez informé des transactions importantes sur votre portefeuille
                </p>
              </div>
            </div>
            {/* À implémenter : un switch pour activer/désactiver */}
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-1">
              <AlertCircle size={20} className="mt-0.5 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Alertes de paiement</h3>
                <p className="text-(--muted-foreground) text-sm">
                  Recevez des rappels avant les dates d'échéance des cotisations
                </p>
              </div>
            </div>
            {/* À implémenter : un switch pour activer/désactiver */}
          </div>
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="bg-(--card) rounded-xl border border-(--border)">
        {recentActivities.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-(--muted-foreground)">Aucune notification pour le moment</p>
          </div>
        ) : (
          <div className="divide-y divide-(--border)">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-5 hover:bg-(--muted) transition">
                {/* Icône selon le type */}
                <div className="flex-shrink-0 mt-1">
                  {activity.type === "contribution" && (
                    <CheckCircle2 size={20} className="text-green-600" />
                  )}
                  {activity.type === "tontine" && (
                    <Users size={20} className="text-blue-600" />
                  )}
                  {activity.type === "disbursement" && (
                    <TrendingUp size={20} className="text-amber-600" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{activity.title}</h3>
                    <p className="text-xs text-(--muted-foreground)">
                      {formatDate(activity.createdAt)}
                    </p>
                  </div>
                  <p className="text-(--muted-foreground)">
                    {activity.message}
                  </p>
                  {activity.amount && (
                    <p className="text-sm font-medium mt-1">
                      {formatCurrency(activity.amount)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bouton pour marquer tout comme lu */}
      <div className="mt-6 text-center">
        <MarkAllReadButton />
      </div>
    </div>
  );
}