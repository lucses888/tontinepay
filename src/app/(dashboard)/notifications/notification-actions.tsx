"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { markAllNotificationsRead } from "./actions";

export function BackButton() {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.back()} className="btn-secondary">
      <ArrowLeft size={20} />
      Retour
    </button>
  );
}

export function MarkAllReadButton({ disabled = false }: { disabled?: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={disabled || isPending}
      onClick={() =>
        startTransition(async () => {
          await markAllNotificationsRead();
          router.refresh();
        })
      }
      className="btn-secondary"
    >
      {isPending && <Loader2 size={16} className="animate-spin" />}
      Marquer tout comme lu
    </button>
  );
}
