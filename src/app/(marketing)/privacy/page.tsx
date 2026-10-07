import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description:
    "Comment TontinePay collecte, utilise et protège vos données personnelles.",
};

const collected = [
  "Informations personnelles : nom, adresse email, numéro de téléphone, date de naissance.",
  "Informations de transaction : détails des cotisations et versements (montants, dates, méthodes de paiement).",
  "Informations d'utilisation : données sur la façon dont vous interagissez avec notre application.",
  "Informations techniques : adresse IP, type de navigateur, informations sur l'appareil.",
];

const usage = [
  "Fournir, maintenir et améliorer notre service.",
  "Traiter vos cotisations et versements.",
  "Communiquer avec vous concernant votre compte et nos services.",
  "Personnaliser votre expérience sur TontinePay.",
  "Prévenir la fraude et assurer la sécurité de notre plateforme.",
  "Respecter nos obligations légales et réglementaires.",
];

const sharing = [
  "Avec des prestataires de services de paiement pour traiter les transactions.",
  "Avec des partenaires de confiance qui nous aident à exploiter notre service (sous strictes obligations de confidentialité).",
  "Lorsque cela est requis par la loi ou pour protéger nos droits légaux.",
  "Avec votre consentement explicite.",
];

const rights = [
  "Accéder aux informations personnelles que nous détenons vous concernant.",
  "Corriger des informations inexactes ou incomplètes.",
  "Demander la suppression de vos informations personnelles.",
  "Vous opposer à ou restreindre le traitement de vos informations.",
  "Portabilité de vos données vers un autre service.",
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">
        Légal
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">
        Politique de Confidentialité
      </h1>
      <p className="mt-4 text-[#0d1f16]/70">
        Dernière mise à jour : octobre 2026
      </p>

      <div className="mt-10 space-y-8">
        <p className="leading-relaxed text-[#0d1f16]/70">
          Chez TontinePay, nous nous engageons à protéger votre vie privée. Cette
          Politique de Confidentialité explique comment nous collectons, utilisons,
          divulguons et sécurisons vos informations lorsque vous utilisez notre
          application. Veuillez lire attentivement cette politique avant
          d&apos;utiliser TontinePay.
        </p>

        <section>
          <h2 className="font-display text-xl font-bold">
            1. Informations que nous collectons
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed text-[#0d1f16]/70">
            {collected.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">
            2. Comment nous utilisons vos informations
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed text-[#0d1f16]/70">
            {usage.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">
            3. Partage de vos informations
          </h2>
          <p className="mt-2 leading-relaxed text-[#0d1f16]/70">
            Nous ne vendons pas vos informations personnelles à des tiers. Nous
            pouvons partager vos informations dans les cas suivants :
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed text-[#0d1f16]/70">
            {sharing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">
            4. Sécurité de vos informations
          </h2>
          <p className="mt-2 leading-relaxed text-[#0d1f16]/70">
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger
            vos informations contre l&apos;accès non autorisé, la modification, la
            divulgation ou la destruction. Ces mesures incluent le chiffrement des
            données sensibles, des serveurs sécurisés et des contrôles d&apos;accès
            stricts.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">5. Vos droits</h2>
          <p className="mt-2 leading-relaxed text-[#0d1f16]/70">
            Selon votre juridiction, vous pouvez avoir le droit de :
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed text-[#0d1f16]/70">
            {rights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">
            6. Conservation des données
          </h2>
          <p className="mt-2 leading-relaxed text-[#0d1f16]/70">
            Nous conservons vos informations personnelles uniquement aussi longtemps
            que nécessaire pour atteindre les objectifs décrits dans cette politique,
            sauf si une période de conservation plus longue est requise ou autorisée
            par la loi.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">
            7. Modifications de notre politique
          </h2>
          <p className="mt-2 leading-relaxed text-[#0d1f16]/70">
            Nous pouvons mettre à jour cette Politique de Confidentialité de temps en
            temps. La date de la dernière révision sera indiquée en haut de cette
            politique. Nous vous encourageons à la consulter périodiquement pour
            rester informé de la façon dont nous protégeons vos informations.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">8. Contact</h2>
          <p className="mt-2 leading-relaxed text-[#0d1f16]/70">
            Si vous avez des questions concernant cette Politique de Confidentialité
            ou nos pratiques en matière de données, veuillez nous contacter à{" "}
            privacy@tontinepay.com ou par courrier à : TontinePay, Service Protection
            des Données, Abidjan, Côte d&apos;Ivoire.
          </p>
        </section>
      </div>

      <div className="mt-12 flex flex-wrap gap-3 border-t border-black/5 pt-8">
        <Link href="/" className="btn-brand">
          Retour à l&apos;accueil <ArrowRight size={16} />
        </Link>
        <Link href="/terms" className="btn-outline">
          Conditions Générales d&apos;Utilisation
        </Link>
      </div>
    </div>
  );
}
