"use client";

import { formatDate, formatCurrency, calculateProgress } from "@/lib/utils";
import { CheckCircle2, Clock, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Contribution {
  id: string;
  userId: string;
  status: string;
  amount: number;
  paidAt: Date | null;
  user: { id: string; name: string | null };
}

interface Cycle {
  id: string;
  cycleNumber: number;
  beneficiaryId: string | null;
  totalAmount: number;
  collectedAmount: number;
  startDate: Date;
  dueDate: Date;
  disbursementDate: Date | null;
  status: string;
  contributions: Contribution[];
}

interface Member {
  id: string;
  userId: string;
  user: { id: string; name: string | null };
}

interface CyclesTabProps {
  cycles: Cycle[];
  members: Member[];
  tontineId: string;
  isAdmin: boolean;
}

export function CyclesTab({ cycles, members, tontineId, isAdmin }: CyclesTabProps) {
  const [expanded, setExpanded] = useState<string | null>(
    cycles.find((c) => c.status === "ACTIVE")?.id ?? null
  );

  if (cycles.length === 0) {
    return (
      <div className="bg-(--card) rounded-xl border border-(--border) p-8 text-center">
        <Clock size={32} className="mx-auto text-(--muted-foreground) mb-3" />
        <p className="text-sm text-(--muted-foreground)">
          Les cycles apparaîtront une fois la tontine démarrée
        </p>
      </div>
    );
  }

  return (
    <div className="bg-(--card) rounded-xl border border-(--border) overflow-hidden">
      <div className="px-5 py-4 border-b border-(--border)">
        <h3 className="font-semibold">Cycles ({cycles.length})</h3>
      </div>

      <div className="divide-y divide-(--border) max-h-[500px] overflow-y-auto">
        {cycles.map((cycle) => {
          const beneficiary = members.find((m) => m.userId === cycle.beneficiaryId);
          const progress = calculateProgress(cycle.collectedAmount, cycle.totalAmount);
          const isOpen = expanded === cycle.id;

          return (
            <div key={cycle.id}>
              <button
                className="w-full flex items-center justify-between p-4 hover:bg-(--muted) transition text-left"
                onClick={() => setExpanded(isOpen ? null : cycle.id)}
              >
                <div className="flex items-center gap-3">
                  <CycleStatusIcon status={cycle.status} />
                  <div>
                    <p className="text-sm font-medium">Cycle {cycle.cycleNumber}</p>
                    <p className="text-xs text-(--muted-foreground)">
                      {beneficiary?.user.name ?? "—"} · {formatDate(cycle.dueDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {cycle.status === "ACTIVE" && (
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">{progress}%</p>
                      <div className="w-16 h-1 bg-(--muted) rounded-full mt-1">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {/* Expanded details */}
              {isOpen && (
                <div className="px-4 pb-4 bg-(--muted)/30">
                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div>
                      <p className="text-(--muted-foreground) text-xs">Montant cagnotte</p>
                      <p className="font-semibold">{formatCurrency(cycle.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-(--muted-foreground) text-xs">Collecté</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(cycle.collectedAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-(--muted-foreground) text-xs">Début</p>
                      <p className="font-medium">{formatDate(cycle.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-(--muted-foreground) text-xs">Échéance</p>
                      <p className="font-medium">{formatDate(cycle.dueDate)}</p>
                    </div>
                  </div>

                  {/* Contributions list */}
                  {cycle.contributions.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-(--muted-foreground) mb-2">
                        Cotisations ({cycle.contributions.filter((c) => c.status === "PAID").length}/{cycle.contributions.length})
                      </p>
                      <div className="space-y-1.5">
                        {cycle.contributions.map((c) => (
                          <div key={c.id} className="flex items-center justify-between text-xs">
                            <span>{c.user.name ?? "—"}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{formatCurrency(c.amount)}</span>
                              <ContribBadge status={c.status} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CycleStatusIcon({ status }: { status: string }) {
  switch (status) {
    case "ACTIVE":
      return (
        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
          <Clock size={14} />
        </div>
      );
    case "COMPLETED":
      return (
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
          <CheckCircle2 size={14} />
        </div>
      );
    case "FAILED":
      return (
        <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
          <AlertTriangle size={14} />
        </div>
      );
    default:
      return (
        <div className="w-8 h-8 rounded-full bg-(--muted) text-(--muted-foreground) flex items-center justify-center">
          <Clock size={14} />
        </div>
      );
  }
}

function ContribBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: "bg-green-100 text-green-700",
    PENDING: "bg-amber-100 text-amber-700",
    LATE: "bg-red-100 text-red-700",
    EXCUSED: "bg-blue-100 text-blue-700",
  };
  const labels: Record<string, string> = {
    PAID: "Payé",
    PENDING: "En attente",
    LATE: "En retard",
    EXCUSED: "Excusé",
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${styles[status] ?? ""}`}>
      {labels[status] ?? status}
    </span>
  );
}
