import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description:
    "Les CGU de TontinePay : règles d'utilisation de la plateforme, cotisations, responsabilité et droit applicable.",
};

const sections = [
  {
    title: "1. Acceptation des Conditions",
    text: "En créant un compte ou en utilisant TontinePay, vous confirmez que vous avez lu, compris et accepté ces Conditions, ainsi que notre Politique de Confidentialité. Ces Conditions constituent un accord légalement contraignant entre vous et TontinePay.",
  },
  {
    title: "2. Description du Service",
    text: "TontinePay est une plateforme digitale permettant de gérer des tontines (groupes d'épargne) de manière sécurisée et transparente. Notre service facilite la création, la gestion et le suivi des tontines, incluant les cotisations, les versements et les communications entre membres.",
  },
  {
    title: "3. Comptes Utilisateurs",
    text: "Pour utiliser certaines fonctionnalités de TontinePay, vous devez créer un compte. Vous êtes responsable du maintien de la confidentialité de votre mot de passe et de toutes les activités qui se produisent sous votre compte. Vous acceptez de nous notifier immédiatement toute utilisation non autorisée de votre compte.",
  },
  {
    title: "4. Cotisations et Paiements",
    text: "Les cotisations sont effectuées via Mobile Money (Orange Money, MTN MoMo, Wave) ou autres méthodes de paiement soutenues. TontinePay agit en tant qu'intermédiaire pour faciliter ces transactions mais ne détient pas les fonds des utilisateurs. Nous ne sommes pas responsables des retards ou échecs de paiement provenant des fournisseurs de services de paiement.",
  },
  {
    title: "5. Responsabilité",
    text: "TontinePay ne sera pas responsable des dommages indirects, accessoires, spéciaux ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser notre service. Notre responsabilité totale envers vous pour toute réclamation ne dépassera pas le montant que vous nous avez payé, le cas échéant, au cours des six (6) mois précédant la réclamation.",
  },
  {
    title: "6. Modifications des Conditions",
    text: "Nous nous réservons le droit de modifier ces Conditions à tout moment. Les modifications prendront effet dès leur publication sur l'application. Votre utilisation continue de TontinePay après de telles modifications constitue votre acceptation des nouvelles Conditions.",
  },
  {
    title: "7. Loi Applicable et Juridiction",
    text: "Ces Conditions sont régies et interprétées conformément aux lois de la Côte d'Ivoire, sans égard à ses principes de conflit de lois. Tout litige découlant de ou lié à ces Conditions sera soumis à la compétence exclusive des tribunaux situés en Côte d'Ivoire.",
  },
  {
    title: "8. Contact",
    text: "Si vous avez des questions concernant ces Conditions, veuillez nous contacter à travers notre formulaire de contact ou par email à legal@tontinepay.com.",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">
        Légal
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">
        Conditions Générales d&apos;Utilisation
      </h1>
      <p className="mt-4 text-[#0d1f16]/70">
        Dernière mise à jour : octobre 2026
      </p>

      <div className="mt-10 space-y-8">
        <p className="leading-relaxed text-[#0d1f16]/70">
          Bienvenue sur TontinePay (&laquo;&nbsp;nous&nbsp;&raquo;, &laquo;&nbsp;notre&nbsp;&raquo;,
          &laquo;&nbsp;TontinePay&nbsp;&raquo;). Ces Conditions Générales d&apos;Utilisation
          (&laquo;&nbsp;Conditions&nbsp;&raquo;) régissent votre accès et votre utilisation de notre
          application web et mobile. En accédant ou en utilisant TontinePay, vous acceptez
          d&apos;être lié par ces Conditions. Si vous n&apos;acceptez pas ces Conditions, veuillez
          ne pas utiliser notre application.
        </p>

        {sections.map(({ title, text }) => (
          <section key={title}>
            <h2 className="font-display text-xl font-bold">{title}</h2>
            <p className="mt-2 leading-relaxed text-[#0d1f16]/70">{text}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3 border-t border-black/5 pt-8">
        <Link href="/" className="btn-brand">
          Retour à l&apos;accueil <ArrowRight size={16} />
        </Link>
        <Link href="/privacy" className="btn-outline">
          Politique de confidentialité
        </Link>
      </div>
    </div>
  );
}
