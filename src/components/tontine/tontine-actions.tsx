"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Share2, Play, Loader2, Copy, Check } from "lucide-react";

interface TontineActionsProps {
  tontine: {
    id: string;
    status: string;
    inviteCode: string;
    memberCount: number;
  };
  isAdmin: boolean;
}

export function TontineActions({ tontine, isAdmin }: TontineActionsProps) {
  const router = useRouter();
  const [copying, setCopying] = useState(false);
  const [starting, setStarting] = useState(false);

  const inviteLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/tontines/join?code=${tontine.inviteCode}`
      : "";

  const copyInviteLink = async () => {
    setCopying(true);
    await navigator.clipboard.writeText(inviteLink);
    setTimeout(() => setCopying(false), 2000);
  };

  const startTontine = async () => {
    if (!confirm("Êtes-vous sûr de vouloir démarrer la tontine ? Cette action est irréversible.")) {
      return;
    }

    setStarting(true);
    try {
      const res = await fetch(`/api/tontines/${tontine.id}/start`, {
        method: "POST",
      });
      const json = await res.json();

      if (res.ok) {
        router.refresh();
        alert(json.message);
      } else {
        alert(json.error ?? "Erreur lors du démarrage");
      }
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      {/* Copier le lien d'invitation */}
      {(tontine.status === "DRAFT" || tontine.status === "PENDING") && (
        <button
          onClick={copyInviteLink}
          className="btn-secondary"
          title="Copier le lien d'invitation"
        >
          {copying ? <Check size={15} className="text-brand" /> : <Copy size={15} />}
          {copying ? "Copié !" : "Inviter"}
        </button>
      )}

      {/* Démarrer (admin + statut DRAFT/PENDING) */}
      {isAdmin && (tontine.status === "DRAFT" || tontine.status === "PENDING") && tontine.memberCount >= 2 && (
        <button
          onClick={startTontine}
          disabled={starting}
          className="btn-primary"
        >
          {starting ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Play size={15} />
          )}
          {starting ? "Démarrage..." : "Démarrer"}
        </button>
      )}
    </div>
  );
}
