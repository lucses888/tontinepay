"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search } from "lucide-react";

const joinSchema = z.object({
  inviteCode: z.string().min(4, "Code invalide").trim(),
});

type JoinInput = z.infer<typeof joinSchema>;

export default function JoinTontinePage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinInput>({
    resolver: zodResolver(joinSchema),
  });

  const onSubmit = async (data: JoinInput) => {
    setServerError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/tontines/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: data.inviteCode }),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Erreur lors de la tentative de rejoindre");
        return;
      }

      setSuccessMessage(json.message ?? "Vous avez rejoint la tontine !");
      setTimeout(() => {
        router.push(`/tontines/${json.data.tontineId}`);
      }, 1500);
    } catch {
      setServerError("Une erreur est survenue. Réessayez.");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Rejoindre une tontine</h2>
        <p className="text-(--muted-foreground) mt-1">
          Entrez le code d&apos;invitation ou collez le lien reçu
        </p>
      </div>

      <div className="bg-(--card) rounded-xl border border-(--border) p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Code d&apos;invitation
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted-foreground)"
              />
              <input
                {...register("inviteCode")}
                type="text"
                placeholder="Collez le code ou le lien ici..."
                className="input-field pl-9 font-mono"
                autoFocus
              />
            </div>
            {errors.inviteCode && (
              <p className="mt-1 text-sm text-red-500">{errors.inviteCode.message}</p>
            )}
          </div>

          {serverError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {serverError}
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              ✓ {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-60 transition"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : null}
            {isSubmitting ? "Vérification..." : "Rejoindre la tontine"}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-(--border)">
          <p className="text-xs text-(--muted-foreground) text-center">
            Le code d&apos;invitation vous a été envoyé par l&apos;administrateur
            de la tontine. Contactez-le si vous ne l&apos;avez pas reçu.
          </p>
        </div>
      </div>
    </div>
  );
}
