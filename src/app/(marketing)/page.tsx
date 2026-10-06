import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CalendarClock,
  Eye,
  Lock,
  Smartphone,
  Users,
} from "lucide-react";
import { InstallButton } from "@/components/pwa/install-button";

const steps = [
  {
    number: "01",
    title: "Créez votre tontine",
    text: "Montant, fréquence, nombre de membres : vous fixez les règles. Un lien d'invitation suffit pour réunir le groupe.",
  },
  {
    number: "02",
    title: "Chacun cotise par Mobile Money",
    text: "Orange Money, MTN MoMo, Wave, Moov Money. Les cotisations sont enregistrées et visibles par tout le groupe.",
  },
  {
    number: "03",
    title: "Le bénéficiaire est payé à l'heure",
    text: "À chaque cycle, la cagnotte est versée au membre désigné. L'historique complet reste consultable, pour toujours.",
  },
];

const features = [
  {
    icon: Smartphone,
    title: "Paiements Mobile Money",
    text: "Vos membres paient depuis l'application qu'ils utilisent déjà tous les jours. Pas de cash, pas de cahier, pas d'oubli.",
  },
  {
    icon: BellRing,
    title: "Rappels avant chaque échéance",
    text: "SMS et notifications avant chaque date de cotisation. Les retardataires sont relancés à votre place.",
  },
  {
    icon: Eye,
    title: "Comptes visibles par tous",
    text: "Qui a payé, combien, quand, qui reçoit le prochain tour : tout est enregistré et consultable par chaque membre.",
  },
  {
    icon: CalendarClock,
    title: "Calendrier des tours",
    text: "L'ordre de passage est défini au départ et respecté. Chacun sait quand son tour arrive, sans discussion.",
  },
  {
    icon: Lock,
    title: "Pénalités et garanties",
    text: "Retards, pénalités et cautions de garantie sont paramétrables et appliqués automatiquement.",
  },
  {
    icon: Users,
    title: "Familles, voisins, collègues",
    text: "De la tontine de quartier au groupe d'entreprise : jusqu'à 50 membres, hebdomadaire ou mensuel.",
  },
];

const testimonials = [
  {
    quote:
      "Avant, je notais les cotisations dans un cahier et je courais après tout le monde. Maintenant, chaque membre voit le compte. Les retards ont presque disparu.",
    name: "Aya Konan",
    role: "Organisatrice d'une tontine de 12 femmes",
    city: "Cocody, Abidjan",
  },
  {
    quote:
      "Notre tontine tourne depuis huit mois sur TontinePay. Le jour du versement, l'argent arrive sur le compte du bénéficiaire et tout le groupe reçoit la confirmation.",
    name: "Ibrahim Traoré",
    role: "Membre d'une tontine mensuelle de 25 personnes",
    city: "Yopougon, Abidjan",
  },
  {
    quote:
      "Ce qui m'a convaincue, c'est la transparence. Ma fille travaille à Dakar et cotise à notre tontine familiale depuis son téléphone.",
    name: "Mariam Cissé",
    role: "Trésorière d'une tontine familiale",
    city: "Bouaké",
  },
];

const faqs = [
  {
    question: "TontinePay garde-t-il l'argent des tontines ?",
    answer:
      "Non. Les fonds vont directement du compte Mobile Money d'un membre vers le compte du bénéficiaire ou de l'organisateur. TontinePay tient les comptes, gère les rappels et les calendriers, mais ne détient jamais l'argent du groupe.",
  },
  {
    question: "Que se passe-t-il si un membre ne paie pas ?",
    answer:
      "Le retard est visible par tout le groupe, des rappels automatiques sont envoyés, et si vous l'avez paramétré, une pénalité s'applique. En cas d'échec répété, l'organisateur peut suspendre ou exclure le membre avant le démarrage d'un cycle.",
  },
  {
    question: "Mes membres n'ont pas de smartphone ?",
    answer:
      "Ils peuvent être invités par un simple lien et cotiser via Mobile Money. L'organisateur peut aussi enregistrer manuellement une cotisation en espèces pour un membre présent physiquement.",
  },
  {
    question: "Combien ça coûte ?",
    answer:
      "Créer une tontine et inviter des membres est gratuit. Une commission de 1 % est prélevée sur chaque versement au bénéficiaire, sans frais cachés. Voir la page Tarifs.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:pb-24 lg:pt-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#0a7b44]/20 bg-[#0a7b44]/5 px-3.5 py-1.5 text-sm font-medium text-[#0a7b44]">
              Épargne collective · Afrique de l'Ouest
            </p>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              La tontine que votre grand-mère connaissait,
              <span className="text-[#0a7b44]"> sans le cahier et les cours de nuit.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#0d1f16]/70">
              TontinePay gère vos cotisations Mobile Money, les rappels et les
              tours de rôle. Chaque membre voit le compte en temps réel —
              personne ne discute plus à la fin du mois.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="btn-brand">
                Créer ma tontine gratuitement
                <ArrowRight size={16} />
              </Link>
              <Link href="/fonctionnalites" className="btn-outline">
                Voir comment ça marche
              </Link>
            </div>
            <p className="mt-4 text-sm text-[#0d1f16]/50">
              Gratuit pour créer · Sans engagement · Orange Money, MTN MoMo, Wave
            </p>
          </div>

          {/* Maquette produit — construite en CSS, pas de capture d'écran */}
          <div className="relative hidden lg:block" aria-hidden="true">
            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#f2b705]/15 blur-2xl" />
            <div className="relative ml-auto w-[380px] rotate-1 rounded-2xl border border-black/8 bg-white p-5 shadow-[0_24px_60px_-20px_rgba(13,31,22,0.25)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#0d1f16]/40">
                    Tontine active
                  </p>
                  <p className="font-display text-lg font-bold">Tontine du marché</p>
                </div>
                <span className="rounded-full bg-[#0a7b44]/10 px-2.5 py-1 text-xs font-semibold text-[#0a7b44]">
                  Cycle 4 / 12
                </span>
              </div>

              <div className="mt-5">
                <div className="flex items-baseline justify-between">
                  <p className="font-display text-3xl font-bold">
                    240 000 <span className="text-base font-semibold text-[#0d1f16]/50">FCFA</span>
                  </p>
                  <p className="text-xs text-[#0d1f16]/50">sur 360 000</p>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-[#0d1f16]/8">
                  <div className="h-full w-2/3 rounded-full bg-[#0a7b44]" />
                </div>
                <p className="mt-1.5 text-xs text-[#0d1f16]/50">
                  8 cotisations reçues · clôture le 30 oct.
                </p>
              </div>

              <div className="mt-5 space-y-2.5 border-t border-black/5 pt-4">
                {[
                  { n: "Aya K.", s: "Payé", ok: true },
                  { n: "Ibrahim T.", s: "Payé", ok: true },
                  { n: "Fatou D.", s: "Rappel envoyé", ok: false },
                  { n: "Koffi A.", s: "Payé", ok: true },
                ].map(({ n, s, ok }) => (
                  <div key={n} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{n}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        ok
                          ? "bg-[#0a7b44]/10 text-[#0a7b44]"
                          : "bg-[#f2b705]/20 text-[#8a6a00]"
                      }`}
                    >
                      {s}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl bg-[#0d1f16] p-3.5 text-white">
                <p className="text-xs text-white/60">Prochaine bénéficiaire</p>
                <p className="mt-0.5 font-display text-base font-bold">
                  Fatou D. — 360 000 FCFA le 30 nov.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Télécharger l'app ────────────────────────────────────────────── */}
      <section className="border-b border-black/5 bg-[#f7f6f2]">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-bold">
              Installez TontinePay sur votre téléphone
            </h2>
            <p className="mt-2 leading-relaxed text-[#0d1f16]/70">
              Application complète, notifications de cotisation, écran d'accueil
              dédié — sans passer par la boutique d'applications. Fonctionne
              même avec une connexion faible, et hors ligne pour consulter vos
              tontines.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-3">
            <InstallButton />
            <span className="text-xs text-[#0d1f16]/50">
              Android, iOS, ordinateur — ~2 Mo
            </span>
          </div>
        </div>
      </section>

      {/* ─── Bandeau confiance ────────────────────────────────────────────── */}
      <section className="border-y border-black/5 bg-[#f7f6f2]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
          {[
            { v: "2 400+", l: "tontines actives" },
            { v: "186 M FCFA", l: "cotisés via la plateforme" },
            { v: "94 %", l: "de cotisations à l'heure" },
            { v: "11", l: "opérateurs Mobile Money" },
          ].map(({ v, l }) => (
            <div key={l}>
              <p className="font-display text-2xl font-bold sm:text-3xl">{v}</p>
              <p className="mt-1 text-sm text-[#0d1f16]/60">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Comment ça marche ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#0a7b44]">
            Comment ça marche
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Trois étapes, puis la tontine tourne toute seule.
          </h2>
        </div>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map(({ number, title, text }) => (
            <div key={number} className="relative">
              <span className="font-display text-5xl font-bold text-[#0a7b44]/15">
                {number}
              </span>
              <h3 className="mt-3 font-display text-xl font-bold">{title}</h3>
              <p className="mt-2 leading-relaxed text-[#0d1f16]/70">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Fonctionnalités ──────────────────────────────────────────────── */}
      <section className="bg-[#0d1f16] py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#f2b705]">
              Ce que TontinePay fait pour vous
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Le travail ingrat d'organisateur, automatisé.
            </h2>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/8">
                  <Icon size={20} className="text-[#f2b705]" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Témoignages ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#0a7b44]">
            Ils l'utilisent déjà
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Des organisateurs qui dorment mieux.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map(({ quote, name, role, city }) => (
            <figure
              key={name}
              className="flex flex-col rounded-2xl border border-black/8 bg-[#f7f6f2] p-6"
            >
              <blockquote className="flex-1 leading-relaxed text-[#0d1f16]/85">
                « {quote} »
              </blockquote>
              <figcaption className="mt-6 border-t border-black/5 pt-4">
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-[#0d1f16]/60">
                  {role} · {city}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-black/5 bg-[#f7f6f2] py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Les questions qu'on nous pose
          </h2>
          <div className="mt-10 divide-y divide-black/8 border-y border-black/8">
            {faqs.map(({ question, answer }) => (
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

      {/* ─── CTA final ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Votre prochaine tontine commence aujourd'hui.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-[#0d1f16]/70">
          Créez-la en cinq minutes, invitez vos membres par lien, et laissez
          TontinePay tenir les comptes.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/register" className="btn-brand">
            Créer ma tontine gratuitement
            <ArrowRight size={16} />
          </Link>
          <Link href="/tarifs" className="btn-outline">
            Voir les tarifs
          </Link>
        </div>
      </section>
    </>
  );
}
