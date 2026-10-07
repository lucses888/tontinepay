"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTontineSchema, type CreateTontineInput } from "@/lib/validations/auth";
import { formatCurrency } from "@/lib/utils";
import { Loader2, ArrowLeft, ArrowRight, Check, Info } from "lucide-react";

const STEPS = [
  { id: 1, title: "Informations" },
  { id: 2, title: "Règles" },
  { id: 3, title: "Confirmation" },
];

const FREQUENCY_LABELS: Record<string, string> = {
  WEEKLY: "Hebdomadaire",
  BIWEEKLY: "Bimensuelle",
  MONTHLY: "Mensuelle",
};

export default function CreateTontinePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CreateTontineInput>({
    resolver: zodResolver(createTontineSchema),
    defaultValues: {
      frequency: "MONTHLY",
      maxMembers: 10,
      rotationMode: "MANUAL",
      isPrivate: true,
      requireGuarantee: false,
      latePenaltyAmount: 500,
      latePenaltyType: "FIXED",
      maxLatePayments: 3,
      allowPositionSwap: true,
    },
  });

  const values = watch();

  const nextStep = async () => {
    const fields: (keyof CreateTontineInput)[][] = [
      ["name", "description", "amount", "frequency", "maxMembers"],
      ["latePenaltyAmount", "latePenaltyType", "maxLatePayments", "requireGuarantee"],
      [],
    ];
    const valid = await trigger(fields[step - 1]);
    if (valid) setStep((s) => Math.min(s + 1, 3));
  };

  const onSubmit = async (data: CreateTontineInput) => {
    setIsSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/tontines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Erreur lors de la création");
        return;
      }

      router.push(`/tontines/${json.data.id}?created=true`);
    } catch {
      setServerError("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="page-title">Créer une tontine</h2>
        <p className="text-(--muted-foreground) mt-1">
          Configurez votre groupe d&apos;épargne en quelques étapes
        </p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  step > s.id
                    ? "bg-brand text-white"
                    : step === s.id
                    ? "bg-brand text-white ring-4 ring-brand-soft"
                    : "bg-(--muted) text-(--muted-foreground)"
                }`}
              >
                {step > s.id ? <Check size={16} /> : s.id}
              </div>
              <span className="text-xs mt-1 text-(--muted-foreground)">{s.title}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-5 transition-colors ${
                  step > s.id ? "bg-brand" : "bg-(--border)"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-(--card) rounded-xl border border-(--border) p-6 space-y-5">

          {/* STEP 1 — Informations générales */}
          {step === 1 && (
            <>
              <h3 className="font-semibold text-lg">Informations générales</h3>

              <div>
                <label className="form-label">
                  Nom de la tontine <span className="text-danger">*</span>
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Ex: Tontine des amis de Yopougon"
                  className="input-field"
                />
                {errors.name && <Error>{errors.name.message}</Error>}
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Décrivez l'objectif de votre tontine..."
                  className="input-field resize-none"
                />
                {errors.description && <Error>{errors.description.message}</Error>}
              </div>

              <div>
                <label className="form-label">
                  Montant de cotisation (XOF) <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("amount", { valueAsNumber: true })}
                    type="number"
                    min={1000}
                    step={500}
                    placeholder="5000"
                    className="input-field pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-(--muted-foreground) font-medium">
                    XOF
                  </span>
                </div>
                {errors.amount && <Error>{errors.amount.message}</Error>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Fréquence</label>
                  <select {...register("frequency")} className="input-field">
                    <option value="WEEKLY">Hebdomadaire</option>
                    <option value="BIWEEKLY">Bimensuelle</option>
                    <option value="MONTHLY">Mensuelle</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">
                    Nombre de membres <span className="text-danger">*</span>
                  </label>
                  <input
                    {...register("maxMembers", { valueAsNumber: true })}
                    type="number"
                    min={2}
                    max={50}
                    className="input-field"
                  />
                  {errors.maxMembers && <Error>{errors.maxMembers.message}</Error>}
                </div>
              </div>

              {/* Preview */}
              {values.amount && values.maxMembers && (
                <div className="bg-brand-soft rounded-lg p-4 text-sm">
                  <p className="font-semibold text-brand-deep mb-2">Aperçu de votre tontine</p>
                  <div className="space-y-1 text-brand-deep">
                    <p>Cagnotte totale par cycle : <strong>{formatCurrency(values.amount * (values.maxMembers || 0))}</strong></p>
                    <p>Durée totale : <strong>{values.maxMembers} {FREQUENCY_LABELS[values.frequency] === "Mensuelle" ? "mois" : "cycles"}</strong></p>
                    <p>Commission plateforme (1%) : <strong>{formatCurrency(values.amount * (values.maxMembers || 0) * 0.01)}</strong></p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2 — Règles */}
          {step === 2 && (
            <>
              <h3 className="font-semibold text-lg">Règles & Pénalités</h3>

              <div>
                <label className="form-label">Mode de rotation</label>
                <select {...register("rotationMode")} className="input-field">
                  <option value="MANUAL">Manuel (admin choisit l&apos;ordre)</option>
                  <option value="RANDOM">Aléatoire (tirage au sort)</option>
                  <option value="AUCTION">Enchères (qui offre le plus passe en premier)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Pénalité de retard</label>
                  <div className="relative">
                    <input
                      {...register("latePenaltyAmount", { valueAsNumber: true })}
                      type="number"
                      min={0}
                      className="input-field pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-(--muted-foreground)">
                      {values.latePenaltyType === "PERCENTAGE" ? "%" : "XOF"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="form-label">Type de pénalité</label>
                  <select {...register("latePenaltyType")} className="input-field">
                    <option value="FIXED">Montant fixe</option>
                    <option value="PERCENTAGE">Pourcentage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">
                  Retards max avant exclusion
                </label>
                <input
                  {...register("maxLatePayments", { valueAsNumber: true })}
                  type="number"
                  min={1}
                  max={10}
                  className="input-field"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <ToggleField
                  label="Caution requise"
                  description="Les membres doivent verser une caution avant de rejoindre"
                  {...register("requireGuarantee")}
                />
                <ToggleField
                  label="Tontine privée"
                  description="Seules les personnes invitées peuvent rejoindre"
                  {...register("isPrivate")}
                />
                <ToggleField
                  label="Échange de position autorisé"
                  description="Les membres peuvent échanger leur tour avec accord mutuel"
                  {...register("allowPositionSwap")}
                />
              </div>
            </>
          )}

          {/* STEP 3 — Confirmation */}
          {step === 3 && (
            <>
              <h3 className="font-semibold text-lg">Récapitulatif</h3>

              <div className="space-y-3">
                <SummaryRow label="Nom" value={values.name ?? "—"} />
                <SummaryRow label="Montant / cycle" value={formatCurrency(values.amount ?? 0)} />
                <SummaryRow label="Fréquence" value={FREQUENCY_LABELS[values.frequency ?? "MONTHLY"]} />
                <SummaryRow label="Membres max" value={`${values.maxMembers ?? 0} personnes`} />
                <SummaryRow label="Mode de rotation" value={values.rotationMode ?? "MANUAL"} />
                <SummaryRow
                  label="Pénalité retard"
                  value={
                    (values.latePenaltyAmount ?? 0) > 0
                      ? `${values.latePenaltyAmount} ${values.latePenaltyType === "PERCENTAGE" ? "%" : "XOF"}`
                      : "Aucune"
                  }
                />
                <SummaryRow label="Tontine privée" value={values.isPrivate ? "Oui" : "Non"} />
              </div>

              <div className="alert-info flex gap-3">
                <Info size={18} className="text-warning shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">
                  Une fois la tontine démarrée, le montant, la fréquence et le nombre de membres
                  ne peuvent plus être modifiés.
                </p>
              </div>

              {serverError && (
                <div className="alert-error">
                  {serverError}
                </div>
              )}
            </>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(s - 1, 1))}
            disabled={step === 1}
            className="btn-secondary"
          >
            <ArrowLeft size={16} />
            Précédent
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn-primary"
            >
              Suivant
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {isSubmitting ? "Création..." : "Créer la tontine"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// ─── Helper Components ─────────────────────────────────────────────────────────

function Error({ children }: { children: React.ReactNode }) {
  return <p className="form-error">{children}</p>;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-(--border) text-sm">
      <span className="text-(--muted-foreground)">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

// eslint-disable-next-line react/display-name
const ToggleField = ({
  label,
  description,
  ...props
}: { label: string; description: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="flex items-start gap-3 cursor-pointer group">
    <div className="relative mt-0.5">
      <input type="checkbox" className="sr-only peer" {...props} />
      <div className="w-10 h-6 bg-(--border) peer-checked:bg-brand rounded-full transition-colors" />
      <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow" />
    </div>
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-(--muted-foreground)">{description}</p>
    </div>
  </label>
);
