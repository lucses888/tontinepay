import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus } from "lucide-react";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Créer une tontine sur TontinePay est gratuit. Une commission unique de 1 % sur chaque versement au bénéficiaire, sans frais cachés ni abonnement.",
};

const plans = [
  {
    name: "Découverte",
    price: "Gratuit",
    unit: "",
    description:
      "Pour tester avec votre premier groupe, sans carte bancaire ni engagement.",
    features: [
      { label: "Jusqu'à 10 membres", ok: true },
      { label: "1 tontine active", ok: true },
      { label: "Cotisations Mobile Money", ok: true },
      { label: "Rappels par notification", ok: true },
      { label: "Comptes visibles par tous", ok: true },
      { label: "Support par email", ok: true },
    ],
    cta: "Commencer gratuitement",
    highlighted: false,
  },
  {
    name: "Tontine",
    price: "1 %",
    unit: "par versement au bénéficiaire",
    description:
      "Le plan standard pour les tontines réelles : familles, quartiers, commerçants, collègues.",
    features: [
      { label: "Jusqu'à 50 membres", ok: true },
      { label: "Tontines illimitées", ok: true },
      { label: "Rappels par SMS + notification", ok: true },
      { label: "Pénalités et cautions de garantie", ok: true },
      { label: "Historique et reçus exportables", ok: true },
      { label: "Support prioritaire WhatsApp", ok: true },
    ],
    cta: "Créer ma tontine",
    highlighted: true,
  },
  {
    name: "Organisation",
    price: "Sur devis",
    unit: "",
    description:
      "Coopératives, entreprises, micro-institutions : gestion multi-groupes et accompagnement dédié.",
    features: [
      { label: "Membres illimités", ok: true },
      { label: "Gestion multi-tontines centralisée", ok: true },
      { label: "Rôles administrateurs avancés", ok: true },
      { label: "Export comptable", ok: true },
      { label: "Accompagnement au déploiement", ok: true },
      { label: "Interlocuteur dédié", ok: true },
    ],
    cta: "Nous contacter",
    highlighted: false,
    ctaHref: "/contact",
  },
];

const faq = [
  {
    question: "La commission de 1 % est-elle prélevée sur l'argent des membres ?",
    answer:
      "Elle est déduite du versement au bénéficiaire, au moment du versement, et affichée dans le compte de la tontine. Si la cagnotte du cycle est de 360 000 FCFA, le bénéficiaire reçoit 356 400 FCFA et la commission apparaît noir sur blanc dans l'historique.",
  },
  {
    question: "Y a-t-il des frais cachés ?",
    answer:
      "Non. Pas d'abonnement, pas de frais de création, pas de frais sur les cotisations. La seule ligne, c'est le 1 % au versement. Les frais éventuels de votre opérateur Mobile Money restent ceux de l'opérateur.",
  },
  {
    question: "Que se passe-t-il si ma tontine s'arrête ?",
    answer:
      "Rien à payer. Vous pouvez clôturer ou dissoudre une tontine à tout moment, l'historique complet reste accessible, et aucun frais n'est dû si aucun versement n'a lieu.",
  },
];

export default function TarifsPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-4 pt-16 sm:px-6 lg:pt-20">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#0a7b44]">
          Tarifs
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Un prix, une ligne, pas de surprise.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#0d1f16]/70">
          Créer et gérer une tontine est gratuit. TontinePay ne prend qu'une
          commission de 1 % sur chaque versement au bénéficiaire — jamais sur
          l'argent cotisé.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map(
            ({ name, price, unit, description, features, cta, highlighted, ctaHref }) => (
              <div
                key={name}
                className={`flex flex-col rounded-2xl border p-7 ${
                  highlighted
                    ? "border-[#0a7b44] bg-white shadow-[0_16px_40px_-16px_rgba(10,123,68,0.35)]"
                    : "border-black/8 bg-[#f7f6f2]"
                }`}
              >
                {highlighted && (
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#0a7b44]">
                    Le plus choisi
                  </p>
                )}
                <h2 className="font-display text-xl font-bold">{name}</h2>
                <p className="mt-4 font-display text-4xl font-bold tracking-tight">
                  {price}
                </p>
                {unit && (
                  <p className="mt-1 text-sm text-[#0d1f16]/60">{unit}</p>
                )}
                <p className="mt-4 text-sm leading-relaxed text-[#0d1f16]/70">
                  {description}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {features.map(({ label, ok }) => (
                    <li key={label} className="flex items-start gap-2.5 text-sm">
                      {ok ? (
                        <Check size={16} className="mt-0.5 shrink-0 text-[#0a7b44]" />
                      ) : (
                        <Minus size={16} className="mt-0.5 shrink-0 text-[#0d1f16]/30" />
                      )}
                      <span className={ok ? "" : "text-[#0d1f16]/40 line-through"}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={ctaHref ?? "/register"}
                  className={`mt-7 ${highlighted ? "btn-brand" : "btn-outline"}`}
                >
                  {cta}
                </Link>
              </div>
            )
          )}
        </div>

        <p className="mt-8 text-center text-sm text-[#0d1f16]/50">
          Commission unique de 1 % au versement · Aucun frais sur les cotisations · Résiliable à tout moment
        </p>
      </section>

      <section className="border-t border-black/5 bg-[#f7f6f2] py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Questions sur les tarifs
          </h2>
          <div className="mt-8 divide-y divide-black/8 border-y border-black/8">
            {faq.map(({ question, answer }) => (
              <details key={question} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold marker:content-none">
                  {question}
                  <span className="shrink-0 text-[#0a7b44] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-[#0d1f16]/70">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
