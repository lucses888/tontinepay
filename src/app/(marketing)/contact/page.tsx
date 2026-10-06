"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError("");
    setSuccessMessage("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          setServerError(json.error ?? "Erreur lors de l'envoi du message");
          return;
        }
        setSuccessMessage(
          "Votre message a été envoyé avec succès ! Nous vous répondrons sous peu."
        );
        (e.target as HTMLFormElement).reset();
      })
      .catch(() => {
        setServerError("Une erreur est survenue. Veuillez réessayer.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#0a7b44]">
        Contact
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
        Parlons de vos tontines.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#0d1f16]/70">
        Une question sur le produit, les tarifs ou un souci technique ?
        L'équipe répond du lundi au samedi.
      </p>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        {/* Formulaire */}
        <div className="rounded-2xl border border-black/8 bg-[#f7f6f2] p-7">
          <h2 className="font-display text-xl font-bold">
            Envoyez-nous un message
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Votre nom complet"
                className="input-field mt-1.5"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="vous@exemple.com"
                className="input-field mt-1.5"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium">
                Sujet
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Objet de votre message"
                className="input-field mt-1.5"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Votre message…"
                className="input-field mt-1.5 resize-none"
              />
            </div>

            {serverError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {serverError}
              </div>
            )}

            {successMessage && (
              <div className="rounded-lg border border-[#0a7b44]/20 bg-[#0a7b44]/5 px-4 py-3 text-sm text-[#0a7b44]">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-brand w-full disabled:opacity-60"
            >
              {isSubmitting ? "Envoi en cours…" : "Envoyer le message"}
            </button>
          </form>
        </div>

        {/* Coordonnées */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <MapPin size={22} className="mt-0.5 shrink-0 text-[#0a7b44]" />
            <div>
              <h3 className="font-semibold">Bureau</h3>
              <p className="mt-1 text-[#0d1f16]/70">
                TontinePay
                <br />
                Cocody, Abidjan, Côte d'Ivoire
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone size={22} className="mt-0.5 shrink-0 text-[#0a7b44]" />
            <div>
              <h3 className="font-semibold">Téléphone / WhatsApp</h3>
              <p className="mt-1 text-[#0d1f16]/70">
                +225 27 22 00 00 00
                <br />
                Lundi – Vendredi : 9h–18h · Samedi : 10h–14h
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Mail size={22} className="mt-0.5 shrink-0 text-[#0a7b44]" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="mt-1 text-[#0d1f16]/70">
                support@tontinepay.com
                <br />
                legal@tontinepay.com (questions juridiques)
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-black/8 bg-[#f7f6f2] p-6">
            <h3 className="font-display font-bold">
              Vous êtes organisateur d'une grande tontine ?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#0d1f16]/70">
              Coopératives, entreprises, associations : nous accompagnons le
              déploiement et la formation de vos membres. Mentionnez-le dans
              votre message, nous vous rappelons sous 24 h.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
