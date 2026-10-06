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
        <h1 className="text-3xl font-bold">Créer un compte 🎉</h1>
        <p className="mt-2 text-(--muted-foreground)">
          Rejoignez des milliers de membres qui épargnent ensemble
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Nom complet */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1.5">
            Nom complet
          </label>
          <input
            {...register("name")}
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Mamadou Diallo"
            className="w-full px-4 py-2.5 rounded-lg border border-(--border) bg-(--card) focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">
            Email
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            className="w-full px-4 py-2.5 rounded-lg border border-(--border) bg-(--card) focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Téléphone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
            Téléphone
          </label>
          <div className="flex gap-2">
            <div className="flex items-center px-3 py-2.5 rounded-lg border border-(--border) bg-(--muted) text-sm font-medium">
              🇨🇮 +225
            </div>
            <input
              {...register("phone")}
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="07 XX XX XX XX"
              className="flex-1 px-4 py-2.5 rounded-lg border border-(--border) bg-(--card) focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Mot de passe */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1.5">
            Mot de passe
          </label>
          <div className="relative">
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 pr-12 rounded-lg border border-(--border) bg-(--card) focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-(--muted-foreground)"
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
                    className={check ? "text-green-500" : "text-gray-300"}
                  />
                  <span className={check ? "text-green-600" : "text-(--muted-foreground)"}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirmer mot de passe */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 pr-12 rounded-lg border border-(--border) bg-(--card) focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-(--muted-foreground)"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Erreur serveur */}
        {serverError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        {/* CGU */}
        <p className="text-xs text-(--muted-foreground) text-center">
          En créant un compte, vous acceptez nos{" "}
          <Link href="/terms" className="text-green-600 hover:underline">
            CGU
          </Link>{" "}
          et notre{" "}
          <Link href="/privacy" className="text-green-600 hover:underline">
            Politique de confidentialité
          </Link>
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition"
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
        <Link href="/login" className="text-green-600 font-semibold hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
