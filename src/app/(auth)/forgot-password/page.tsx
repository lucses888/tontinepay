"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";
import { Mail, Loader2, LogIn } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: formIsSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsSubmitting(true);
    setServerError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Erreur lors de la demande");
        return;
      }

      setSuccessMessage(
        "Si un compte existe avec cette adresse email, vous recevrez bientôt des instructions pour réinitialiser votre mot de passe."
      );
    } catch (error) {
      setServerError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto lg:max-w-md">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-(--foreground)">Mot de passe oublié</h1>
        <p className="mt-2 text-(--muted-foreground)">
          Entrez votre adresse email pour recevoir des instructions de réinitialisation
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">
            Email <span className="text-red-500">*</span>
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

        {/* Message de succès ou d'erreur */}
        {serverError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        {successMessage && (
          <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
            {successMessage}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || formIsSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition"
        >
          {isSubmitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Mail size={18} />
          )}
          {isSubmitting ? "Envoi..." : "Envoyer les instructions"}
        </button>
      </form>

      {/* Back to login link */}
      <p className="mt-6 text-center text-sm text-(--muted-foreground)">
        Vous vous souvenez de votre mot de passe ?{" "}
        <Link href="/login" className="text-green-600 font-semibold hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}