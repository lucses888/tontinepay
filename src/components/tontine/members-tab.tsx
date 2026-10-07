"use client";

import { formatDate, formatCurrency, getInitials } from "@/lib/utils";
import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

interface Member {
  id: string;
  userId: string;
  role: string;
  status: string;
  rotationPosition: number | null;
  hasReceivedPot: boolean;
  latePayments: number;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    reliabilityScore: number;
  };
}

interface Contribution {
  id: string;
  userId: string;
  status: string;
  amount: number;
  paidAt: Date | null;
}

interface MembersTabProps {
  members: Member[];
  activeCycleContributions: Contribution[];
  isAdmin: boolean;
  currentUserId: string;
}

export function MembersTab({
  members,
  activeCycleContributions,
  isAdmin,
  currentUserId,
}: MembersTabProps) {
  return (
    <div className="bg-(--card) rounded-xl border border-(--border) overflow-hidden">
      <div className="px-5 py-4 border-b border-(--border)">
        <h3 className="font-semibold">Membres ({members.length})</h3>
      </div>

      <div className="divide-y divide-(--border)">
        {members.map((member) => {
          const contrib = activeCycleContributions.find(
            (c) => c.userId === member.userId
          );
          const isCurrentUser = member.userId === currentUserId;

          return (
            <div
              key={member.id}
              className={`flex items-center justify-between p-4 ${
                isCurrentUser ? "bg-brand-soft/50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Position */}
                <div className="w-7 h-7 rounded-full bg-(--muted) text-(--muted-foreground) text-xs font-bold flex items-center justify-center shrink-0">
                  {member.rotationPosition ?? "—"}
                </div>

                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-brand-soft text-brand-deep font-semibold text-sm flex items-center justify-center shrink-0">
                  {getInitials(member.user.name ?? member.user.email)}
                </div>

                {/* Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">
                      {member.user.name ?? member.user.email.split("@")[0]}
                      {isCurrentUser && (
                        <span className="ml-1 text-xs text-brand font-normal">(vous)</span>
                      )}
                    </p>
                    {member.role !== "MEMBER" && (
                      <span className="text-xs bg-brand-soft text-brand-deep px-1.5 py-0.5 rounded font-medium">
                        {member.role === "ADMIN" ? "Admin" : "Co-admin"}
                      </span>
                    )}
                    {member.hasReceivedPot && (
                      <span title="A reçu la cagnotte">
                        <CheckCircle2 size={14} className="text-brand" />
                      </span>
                    )}
                  </div>
                  {member.latePayments > 0 && (
                    <p className="text-xs text-warning flex items-center gap-1">
                      <AlertTriangle size={11} />
                      {member.latePayments} retard(s)
                    </p>
                  )}
                </div>
              </div>

              {/* Contribution status */}
              <ContributionIcon status={contrib?.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContributionIcon({ status }: { status?: string }) {
  if (!status) {
    return (
      <span title="En attente">
        <Clock size={18} className="text-(--muted-foreground)" />
      </span>
    );
  }
  switch (status) {
    case "PAID":
      return (
        <span title="Payé">
          <CheckCircle2 size={18} className="text-brand" />
        </span>
      );
    case "LATE":
      return (
        <span title="En retard">
          <AlertTriangle size={18} className="text-warning" />
        </span>
      );
    case "EXCUSED":
      return (
        <span title="Excusé">
          <XCircle size={18} className="text-info" />
        </span>
      );
    case "CANCELLED":
      return (
        <span title="Annulé">
          <XCircle size={18} className="text-danger" />
        </span>
      );
    default:
      return <Clock size={18} className="text-(--muted-foreground)" />;
  }
}
