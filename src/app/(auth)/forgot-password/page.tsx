"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";
import { Mail, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
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
    } catch {
      setServerError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto lg:max-w-md">
      <div className="mb-8">
        <h1 className="page-title text-3xl">Mot de passe oublié</h1>
        <p className="mt-2 text-(--muted-foreground)">
          Entrez votre adresse email pour recevoir des instructions de
          réinitialisation
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

        {/* Message de succès ou d'erreur */}
        {serverError && <div className="alert-error">{serverError}</div>}

        {successMessage && (
          <div className="alert-success">{successMessage}</div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || formIsSubmitting}
          className="btn-primary w-full py-3"
        >
          {isSubmitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Mail size={18} />
          )}
          {isSubmitting ? "Envoi..." : "Envoyer les instructions"}
        </button>
      </form>

      {/* Retour au login */}
      <p className="mt-6 text-center text-sm text-(--muted-foreground)">
        Vous vous souvenez de votre mot de passe ?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
