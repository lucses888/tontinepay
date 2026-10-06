import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BellRing, CalendarClock, Eye, FileText, Lock, Smartphone, Users, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "Fonctionnalités",
  description:
    "Cotisations Mobile Money, rappels automatiques, calendrier des tours, comptes transparents : tout ce que TontinePay apporte à votre tontine.",
};

const sections = [
  {
    icon: Smartphone,
    title: "Cotisations Mobile Money",
    text: "Vos membres paient depuis Orange Money, MTN MoMo, Wave, Moov Money ou Free Money. Chaque paiement est enregistré avec sa référence de transaction, visible par tout le groupe. Les cotisations en espèces peuvent être saisies manuellement par l'organisateur, pour les membres sans smartphone.",
  },
  {
    icon: BellRing,
    title: "Rappels automatiques",
    text: "Trois jours avant, la veille, le jour même : les rappels partent automatiquement par notification et SMS. Vous ne courez plus après les retardataires — et les retards baissent mécaniquement.",
  },
  {
    icon: Eye,
    title: "Comptes transparents",
    text: "Qui a payé, combien, quand, qui reçoit le prochain tour, quelle commission est prélevée : chaque membre consulte le compte complet de la tontine. La confiance n'a plus besoin d'être demandée, elle s'affiche.",
  },
  {
    icon: Users,
    title: "Gestion des membres",
    text: "Invitations par lien ou code, rôles organisateur et co-organisateur, suspension et exclusion en cas d'impayés répétés. Jusqu'à 50 membres par tontine, hebdomadaire, bimensuelle ou mensuelle.",
  },
  {
    icon: CalendarClock,
    title: "Calendrier et tours de rôle",
    text: "L'ordre de passage est fixé au démarrage — manuellement, au hasard ou par enchère. Chacun connaît la date de son versement dès le premier jour, et les échanges de position sont autorisés si vous le souhaitez.",
  },
  {
    icon: Lock,
    title: "Pénalités et garanties",
    text: "Pénalité fixe ou en pourcentage après un retard paramétrable, caution de garantie obligatoire ou facultative : vous définissez les règles, TontinePay les applique sans favoritisme ni oubli.",
  },
  {
    icon: Wallet,
    title: "Versements au bénéficiaire",
    text: "À la clôture de chaque cycle, la cagnotte nette de commission est versée au bénéficiaire du tour. Le montant, la date et la référence de transaction sont consignés dans l'historique, inaltérable.",
  },
  {
    icon: FileText,
    title: "Historique et reçus",
    text: "Chaque cotisation et chaque versement génère une trace consultable à tout moment — pratique pour les tontines de longue durée, les changements de trésorier ou les vérifications entre membres.",
  },
];

export default function FonctionnalitesPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-4 pt-16 sm:px-6 lg:pt-20">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#0a7b44]">
          Fonctionnalités
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Tout ce qu'il faut pour faire tourner une tontine sérieuse.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#0d1f16]/70">
          TontinePay ne remplace pas vos règles — il les applique. Vous gardez
          la main sur l'organisation, la plateforme tient les comptes, envoie
          les rappels et trace chaque franc.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2">
          {sections.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-black/8 bg-[#f7f6f2] p-7"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0a7b44]/10">
                <Icon size={20} className="text-[#0a7b44]" />
              </span>
              <h2 className="mt-4 font-display text-xl font-bold">{title}</h2>
              <p className="mt-2 leading-relaxed text-[#0d1f16]/70">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-black/5 bg-[#f7f6f2] py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-bold">
              Une fonctionnalité en tête qui manque ici ?
            </h2>
            <p className="mt-2 text-[#0d1f16]/70">
              La feuille de route est construite avec les organisateurs.
              Dites-nous ce qui vous ferait gagner du temps.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/contact" className="btn-brand">
              Nous écrire
            </Link>
            <Link href="/register" className="btn-outline">
              Essayer <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
