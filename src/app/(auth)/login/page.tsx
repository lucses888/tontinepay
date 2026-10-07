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
        <h1 className="page-title text-3xl">Bon retour !</h1>
        <p className="mt-2 text-(--muted-foreground)">
          Connectez-vous pour gérer vos tontines
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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

        {/* Mot de passe */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="form-label mb-0">
              Mot de passe
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-brand hover:underline"
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
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}
        </div>

        {/* Erreur serveur */}
        {serverError && <div className="alert-error">{serverError}</div>}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-3"
        >
          {isSubmitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <LogIn size={18} />
          )}
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      {/* Lien inscription */}
      <p className="mt-6 text-center text-sm text-(--muted-foreground)">
        Pas encore de compte ?{" "}
        <Link href="/register" className="font-semibold text-brand hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
