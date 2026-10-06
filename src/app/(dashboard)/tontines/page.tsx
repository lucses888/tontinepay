import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatCurrency, formatDate, calculateProgress } from "@/lib/utils";
import { Plus, Search, Filter } from "lucide-react";
import type { TontineStatus } from "@/types";

interface SearchParams {
  status?: string;
  q?: string;
}

export default async function TontinesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { status, q } = await searchParams;
  const userId = session.user.id;

  const tontines = await prisma.tontine.findMany({
    where: {
      members: {
        some: { userId, status: { not: "EXCLUDED" } },
      },
      ...(status ? { status: status as TontineStatus } : {}),
      ...(q
        ? { name: { contains: q, mode: "insensitive" } }
        : {}),
    },
    include: {
      members: {
        where: { status: { not: "EXCLUDED" } },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
      cycles: {
        where: { status: "ACTIVE" },
        take: 1,
      },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  const statusTabs: { value: string; label: string }[] = [
    { value: "", label: "Toutes" },
    { value: "ACTIVE", label: "Actives" },
    { value: "DRAFT", label: "Brouillons" },
    { value: "PENDING", label: "En attente" },
    { value: "COMPLETED", label: "Terminées" },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Mes tontines</h2>
          <p className="text-(--muted-foreground) mt-1">
            {tontines.length} tontine{tontines.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/tontines/join"
            className="px-4 py-2 rounded-lg border border-(--border) text-sm font-medium hover:bg-(--muted) transition"
          >
            Rejoindre
          </Link>
          <Link
            href="/tontines/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
          >
            <Plus size={16} />
            Nouvelle
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted-foreground)"
          />
          <form>
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Rechercher une tontine..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-(--border) bg-(--card) text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </form>
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 bg-(--muted) p-1 rounded-lg overflow-x-auto">
          {statusTabs.map(({ value, label }) => (
            <Link
              key={value}
              href={value ? `/tontines?status=${value}` : "/tontines"}
              className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition ${
                status === value || (!status && !value)
                  ? "bg-(--card) shadow-sm"
                  : "text-(--muted-foreground) hover:text-(--foreground)"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Tontines grid */}
      {tontines.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🤝</div>
          <h3 className="text-lg font-semibold mb-2">Aucune tontine trouvée</h3>
          <p className="text-(--muted-foreground) mb-6 text-sm">
            Créez votre première tontine ou rejoignez un groupe existant
          </p>
          <Link
            href="/tontines/new"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700"
          >
            <Plus size={16} />
            Créer une tontine
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tontines.map((t) => {
            const activeCycle = t.cycles[0];
            const userMember = t.members.find((m) => m.userId === userId);
            const progress = activeCycle
              ? calculateProgress(activeCycle.collectedAmount, activeCycle.totalAmount)
              : 0;
            const avatars = t.members.slice(0, 4);

            return (
              <Link
                key={t.id}
                href={`/tontines/${t.id}`}
                className="bg-(--card) rounded-xl border border-(--border) p-5 card-hover block group"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="font-semibold text-base truncate group-hover:text-green-600 transition-colors">
                      {t.name}
                    </h4>
                    <p className="text-sm text-(--muted-foreground) mt-0.5">
                      {FREQ_LABELS[t.frequency]} · {t.members.length}/{t.maxMembers} membres
                    </p>
                  </div>
                  <StatusBadge status={t.status} />
                </div>

                {/* Amount */}
                <p className="text-2xl font-bold text-green-600 mb-1">
                  {formatCurrency(t.amount)}
                  <span className="text-sm text-(--muted-foreground) font-normal"> /cycle</span>
                </p>

                {/* Cycle & progress */}
                {t.status === "ACTIVE" && activeCycle && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-(--muted-foreground) mb-1">
                      <span>Cycle {t.currentCycle}/{t.totalCycles}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-(--muted) rounded-full">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-(--muted-foreground) mt-1">
                      Échéance : {formatDate(activeCycle.dueDate)}
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-3">
                  {/* Avatars */}
                  <div className="flex -space-x-2">
                    {avatars.map((m) => (
                      <div
                        key={m.id}
                        className="w-7 h-7 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center justify-center ring-2 ring-(--card)"
                        title={m.user.name ?? ""}
                      >
                        {(m.user.name ?? "?")[0].toUpperCase()}
                      </div>
                    ))}
                    {t.members.length > 4 && (
                      <div className="w-7 h-7 rounded-full bg-(--muted) text-xs font-semibold flex items-center justify-center ring-2 ring-(--card) text-(--muted-foreground)">
                        +{t.members.length - 4}
                      </div>
                    )}
                  </div>

                  {/* Role badge */}
                  {(userMember?.role === "ADMIN" || userMember?.role === "CO_ADMIN") && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Admin
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const FREQ_LABELS: Record<string, string> = {
  WEEKLY: "Hebdo",
  BIWEEKLY: "Bimensuelle",
  MONTHLY: "Mensuelle",
};

const STATUS_CONFIG: Record<
  TontineStatus,
  { label: string; className: string }
> = {
  DRAFT: { label: "Brouillon", className: "bg-gray-100 text-gray-600" },
  PENDING: { label: "En attente", className: "bg-amber-100 text-amber-700" },
  ACTIVE: { label: "Active", className: "bg-green-100 text-green-700" },
  COMPLETED: { label: "Terminée", className: "bg-blue-100 text-blue-700" },
  DISSOLVED: { label: "Dissoute", className: "bg-red-100 text-red-700" },
};

function StatusBadge({ status }: { status: TontineStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${config.className}`}>
      {config.label}
    </span>
  );
}
