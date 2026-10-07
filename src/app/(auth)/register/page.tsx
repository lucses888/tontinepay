"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { Eye, EyeOff, Loader2, UserPlus, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const onSubmit = async (data: RegisterInput) => {
    setServerError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Erreur lors de la création du compte");
        return;
      }

      // Rediriger vers login avec message de succès
      router.push("/login?registered=true");
    } catch {
      setServerError("Une erreur est survenue. Réessayez.");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto lg:max-w-md">
      <div className="mb-8">
        <h1 className="page-title text-3xl">Créer un compte</h1>
        <p className="mt-2 text-(--muted-foreground)">
          Rejoignez des milliers de membres qui épargnent ensemble
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Nom complet */}
        <div>
          <label htmlFor="name" className="form-label">
            Nom complet
          </label>
          <input
            {...register("name")}
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Aya Konan"
            className="input-field"
          />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            className="input-field"
          />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>

        {/* Téléphone */}
        <div>
          <label htmlFor="phone" className="form-label">
            Téléphone
          </label>
          <div className="flex gap-2">
            <div className="flex shrink-0 items-center rounded-[0.625rem] border border-(--border) bg-(--muted) px-3 text-sm font-medium text-(--muted-foreground)">
              🇨🇮 +225
            </div>
            <input
              {...register("phone")}
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="07 XX XX XX XX"
              className="input-field"
            />
          </div>
          {errors.phone && <p className="form-error">{errors.phone.message}</p>}
        </div>

        {/* Mot de passe */}
        <div>
          <label htmlFor="password" className="form-label">
            Mot de passe
          </label>
          <div className="relative">
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className="input-field pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-(--muted-foreground) transition hover:text-(--foreground)"
              aria-label={showPassword ? "Masquer" : "Afficher"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {/* Indicateurs de force */}
          {password && (
            <div className="mt-2 space-y-1">
              {[
                { check: passwordChecks.length, label: "8 caractères minimum" },
                { check: passwordChecks.uppercase, label: "Une majuscule" },
                { check: passwordChecks.number, label: "Un chiffre" },
              ].map(({ check, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs">
                  <Check
                    size={12}
                    className={check ? "text-brand" : "text-[#c9d2cc]"}
                  />
                  <span
                    className={check ? "font-medium text-brand" : "text-(--muted-foreground)"}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}
        </div>

        {/* Confirmer mot de passe */}
        <div>
          <label htmlFor="confirmPassword" className="form-label">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className="input-field pr-11"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-(--muted-foreground) transition hover:text-(--foreground)"
              aria-label={showConfirm ? "Masquer" : "Afficher"}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="form-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Erreur serveur */}
        {serverError && <div className="alert-error">{serverError}</div>}

        {/* CGU */}
        <p className="text-center text-xs text-(--muted-foreground)">
          En créant un compte, vous acceptez nos{" "}
          <Link href="/terms" className="font-medium text-brand hover:underline">
            CGU
          </Link>{" "}
          et notre{" "}
          <Link href="/privacy" className="font-medium text-brand hover:underline">
            Politique de confidentialité
          </Link>
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-3"
        >
          {isSubmitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <UserPlus size={18} />
          )}
          {isSubmitting ? "Création..." : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-(--muted-foreground)">
        Déjà un compte ?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
