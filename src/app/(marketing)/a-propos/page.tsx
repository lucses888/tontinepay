import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "TontinePay est né à Abidjan d'un constat simple : les tontines fonctionnent, mais la tenue de comptes à la main épuise les organisateurs. Notre mission : garder la confiance, supprimer la paperasse.",
};

const values = [
  {
    title: "La transparence n'est pas une option",
    text: "Chaque franc cotisé est tracé et visible par les membres de la tontine. Nous ne détenons pas l'argent des groupes : notre rôle est de tenir les comptes, pas les caisses.",
  },
  {
    title: "Conçu depuis Abidjan, pour la région",
    text: "L'équipe vit les réalités qu'elle construit : Mobile Money d'abord, français et bientôt les langues locales, un produit qui fonctionne sur des connexions modestes et des téléphones d'entrée de gamme.",
  },
  {
    title: "La technologie au service de l'usage",
    text: "La tontine existe depuis des siècles et fonctionne très bien. Nous n'avons pas inventé un modèle : nous avons retiré le cahier, les relances et les malentendus.",
  },
];

export default function AProposPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-4 pt-16 sm:px-6 lg:pt-20">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#0a7b44]">
          À propos
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Nous rendons service aux organisateurs de tontines.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#0d1f16]/70">
          TontinePay est né à Abidjan d'un constat simple : les tontines
          fonctionnent, mais tenir les comptes à la main épuise ceux qui
          s'en occupent.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6 leading-relaxed text-[#0d1f16]/80">
            <p>
              Dans quasiment chaque quartier d'Afrique de l'Ouest, une tontine
              tourne. Les montants financent les rentées scolaires,les stocks de boutique, les mariages, les imprévus. Le système
              social est solide — c'est son administration qui casse :
              cahiers perdus, cotisations oubliées, soupçons qui pourrissent
              l'ambiance.
            </p>
            <p>
              TontinePay est parti de là. Pas d'une idée de fintech, mais
              d'organisatrices et d'organisateurs qui passaient leurs
              week-ends à réconcilier des listes. Notre produit fait
              exactement ce qu'ils faisaient — rappels, comptes, calendrier
              des tours — sauf qu'il ne se trompe jamais et ne se fatigue
              pas.
            </p>
            <p>
              Nous croyons que la finance communautaire mérite des outils
              sérieux. Pas pour la remplacer, mais pour lui donner la
              fiabilité d'une banque avec la chaleur d'un groupe qui se
              connaît.
            </p>
          </div>

          <div className="space-y-6">
            {values.map(({ title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-black/8 bg-[#f7f6f2] p-6"
              >
                <h2 className="font-display text-lg font-bold">{title}</h2>
                <p className="mt-2 leading-relaxed text-[#0d1f16]/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-[#0d1f16] py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-3">
          {[
            { v: "2024", l: "année de lancement à Abidjan" },
            { v: "2 400+", l: "tontines qui tournent sur la plateforme" },
            { v: "8", l: "personnes à l'équipe, dont 6 à Abidjan" },
          ].map(({ v, l }) => (
            <div key={l}>
              <p className="font-display text-3xl font-bold sm:text-4xl">{v}</p>
              <p className="mt-1 text-sm text-white/60">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h2 className="font-display text-2xl font-bold">
            Envie de voir ce que ça donne sur vos groupes ?
          </h2>
          <p className="mt-2 text-[#0d1f16]/70">
            La création de tontine est gratuite, et vous gardez vos règles.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/register" className="btn-brand">
            Créer un compte <ArrowRight size={15} />
          </Link>
          <Link href="/contact" className="btn-outline">
            Nous poser une question
          </Link>
        </div>
      </section>
    </>
  );
}
