import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { formatRelativeTime } from "@/lib/utils";
import type { NotificationType } from "@prisma/client";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Gift,
  Rocket,
  Users,
  Megaphone,
  Settings,
} from "lucide-react";
import { BackButton, MarkAllReadButton } from "./notification-actions";

function NotificationIcon({ type }: { type: NotificationType }) {
  switch (type) {
    case "CONTRIBUTION_PAID":
      return <CheckCircle2 size={20} className="text-brand" />;
    case "CONTRIBUTION_DUE":
    case "CONTRIBUTION_LATE":
    case "PENALTY_APPLIED":
      return <AlertCircle size={20} className="text-danger" />;
    case "POT_RECEIVED":
      return <Gift size={20} className="text-warning" />;
    case "MEMBER_JOINED":
    case "MEMBER_LEFT":
      return <Users size={20} className="text-info" />;
    case "TONTINE_STARTED":
    case "CYCLE_STARTED":
    case "CYCLE_COMPLETED":
    case "TONTINE_COMPLETED":
      return <Rocket size={20} className="text-purple-600" />;
    case "ANNOUNCEMENT":
      return <Megaphone size={20} className="text-info" />;
    default:
      return <Bell size={20} className="text-(--muted-foreground)" />;
  }
}

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <BackButton />
        <h1 className="page-title">Notifications</h1>
        <div className="min-w-24 text-right">
          {unreadCount > 0 && (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-brand">
              <span className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
              {unreadCount > 1 ? "nouvelles" : "nouvelle"}
            </span>
          )}
        </div>
      </div>

      {/* Lien vers les préférences */}
      <Link
        href="/settings"
        className="flex items-center gap-3 bg-(--card) rounded-xl border border-(--border) p-4 hover:bg-(--muted) transition"
      >
        <Settings size={18} className="text-(--muted-foreground)" />
        <span className="text-sm">
          Gérez vos alertes email et SMS dans les <span className="font-medium text-brand">paramètres</span>
        </span>
      </Link>

      {/* Liste des notifications */}
      <div className="bg-(--card) rounded-xl border border-(--border)">
        {notifications.length === 0 ? (
          <div className="p-10 text-center">
            <Bell size={32} className="mx-auto mb-3 text-(--muted-foreground)" />
            <p className="text-(--muted-foreground)">Aucune notification pour le moment</p>
          </div>
        ) : (
          <div className="divide-y divide-(--border)">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-4 p-5 transition hover:bg-(--muted) ${
                  n.isRead ? "" : "bg-brand-soft/60"
                }`}
              >
                <div className="shrink-0 mt-1">
                  <NotificationIcon type={n.type} />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between gap-3">
                    <h3 className={`${n.isRead ? "font-medium" : "font-semibold"}`}>
                      {n.title}
                    </h3>
                    <p className="text-xs text-(--muted-foreground) whitespace-nowrap">
                      {formatRelativeTime(n.createdAt)}
                    </p>
                  </div>
                  <p className="text-sm text-(--muted-foreground)">{n.message}</p>
                </div>
                {!n.isRead && (
                  <span className="mt-2 w-2 h-2 rounded-full bg-brand shrink-0" aria-label="Non lue" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bouton pour marquer tout comme lu */}
      <div className="mt-6 text-center">
        <MarkAllReadButton disabled={unreadCount === 0} />
      </div>
    </div>
  );
}
