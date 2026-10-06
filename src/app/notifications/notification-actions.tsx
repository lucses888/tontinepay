"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-(--border) hover:bg-(--muted) transition"
    >
      <ArrowLeft size={20} />
      Retour
    </button>
  );
}

export function MarkAllReadButton() {
  return (
    <button
      onClick={() => {
        // Dans une vraie app, vous mettriez à jour la table des notifications
        alert("Toutes les notifications marquées comme lues");
      }}
      className="px-6 py-2.5 rounded-lg border border-(--border) text-sm font-medium hover:bg-(--muted) transition"
    >
      Marquer tout comme lu
    </button>
  );
}
