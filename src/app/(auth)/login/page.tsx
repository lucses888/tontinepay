"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError("");
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError("Email ou mot de passe incorrect");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setServerError("Une erreur est survenue. Réessayez.");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto lg:max-w-md">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-(--foreground)">Bon retour ! 👋</h1>
        <p className="mt-2 text-(--muted-foreground)">
          Connectez-vous pour gérer vos tontines
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
            className="w-full px-4 py-2.5 rounded-lg border border-(--border) bg-(--card) text-(--foreground) placeholder-text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Mot de passe */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium">
              Mot de passe
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-green-600 hover:underline"
            >
              Oublié ?
            </Link>
          </div>
          <div className="relative">
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 pr-12 rounded-lg border border-(--border) bg-(--card) text-(--foreground) focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-(--muted-foreground) hover:text-(--foreground)"
              aria-label={showPassword ? "Masquer" : "Afficher"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Erreur serveur */}
        {serverError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition"
        >
          {isSubmitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <LogIn size={18} />
          )}
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      {/* Register link */}
      <p className="mt-6 text-center text-sm text-(--muted-foreground)">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-green-600 font-semibold hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
