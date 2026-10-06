import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-(--border) bg-(--card)/80 backdrop-blur-sm sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-2xl">🤝</span>
          <span className="font-bold text-lg text-green-600">TontinePay</span>
        </Link>
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-medium text-(--muted-foreground) hover:text-(--foreground) transition"
        >
          Connexion
        </Link>
      </nav>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold text-center mb-6">
            Politique de Confidentialité
          </h1>

          <div className="bg-(--card) rounded-xl border border-(--border) p-8 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-(--muted-foreground) mb-4">
              Chez TontinePay, nous nous engageons à protéger votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons et sécurisons vos informations lorsque vous utilisez notre application. Veuillez lire attentivement cette politique avant d'utiliser TontinePay.
            </p>

            <h2 className="text-xl font-semibold mb-3">1. Informations Que Nous Collectons</h2>
            <p className="text-(--muted-foreground) mb-3">
              Nous pouvons collecter différents types d'informations, notamment :
            </p>
            <ul className="list-disc list-inside text-(--muted-foreground) mb-4 space-y-1">
              <li className="mb-1">Informations personnelles : nom, adresse email, numéro de téléphone, date de naissance.</li>
              <li className="mb-1">Informations de transaction : détails des cotisations et versements (montants, dates, méthodes de paiement).</li>
              <li className="mb-1">Informations d'utilisation : données sur la façon dont vous interagissez avec notre application.</li>
              <li className="mb-1">Informations techniques : adresse IP, type de navigateur, informations sur l'appareil.</li>
            </ul>

            <h2 className="text-xl font-semibold mb-3">2. Comment Nous Utilisons Vos Informations</h2>
            <p className="text-(--muted-foreground) mb-3">
              Nous utilisons vos informations pour :
            </p>
            <ul className="list-disc list-inside text-(--muted-foreground) mb-4 space-y-1">
              <li className="mb-1">Fournir, maintenir et améliorer notre service.</li>
              <li className="mb-1">Traiter vos cotisations et versements.</li>
              <li className="mb-1">Communiquer avec vous concernant votre compte et nos services.</li>
              <li className="mb-1">Personnaliser votre expérience sur TontinePay.</li>
              <li className="mb-1">Prévenir la fraude et assurer la sécurité de notre plateforme.</li>
              <li className="mb-1">Respecter nos obligations légales et réglementaires.</li>
            </ul>

            <h2 className="text-xl font-semibold mb-3">3. Partage de Vos Informations</h2>
            <p className="text-(--muted-foreground) mb-3">
              Nous ne vendons pas vos informations personnelles à des tiers. Nous pouvons partager vos informations dans les cas suivants :
            </p>
            <ul className="list-disc list-inside text-(--muted-foreground) mb-4 space-y-1">
              <li className="mb-1">Avec des prestataires de services de paiement pour traiter les transactions.</li>
              <li className="mb-1">Avec des partenaires de confiance qui nous aident à exploiter notre service (sous strictes obligations de confidentialité).</li>
              <li className="mb-1">Lorsque cela est requis par la loi ou pour protéger nos droits légaux.</li>
              <li className="mb-1">Avec votre consentement explicite.</li>
            </ul>

            <h2 className="text-xl font-semibold mb-3">4. Sécurité de Vos Informations</h2>
            <p className="text-(--muted-foreground) mb-3">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations contre l'accès non autorisé, la modification, la divulgation ou la destruction. Ces mesures incluent le chiffrement des données sensibles, des serveurs sécurisés et des contrôles d'accès stricts.
            </p>

            <h2 className="text-xl font-semibold mb-3">5. Vos Droits</h2>
            <p className="text-(--muted-foreground) mb-3">
              Selon votre juridiction, vous pouvez avoir le droit de :
            </p>
            <ul className="list-disc list-inside text-(--muted-foreground) mb-4 space-y-1">
              <li className="mb-1">Accéder aux informations personnelles que nous détenons vous concernant.</li>
              <li className="mb-1">Corriger des informations inexactes ou incomplètes.</li>
              <li className="mb-1">Demander la suppression de vos informations personnelles.</li>
              <li className="mb-1">Vous opposer à ou restreindre le traitement de vos informations.</li>
              <li className="mb-1">Portabilité de vos données vers un autre service.</li>
            </ul>

            <h2 className="text-xl font-semibold mb-3">6. Conservation des Données</h2>
            <p className="text-(--muted-foreground) mb-3">
              Nous conservons vos informations personnelles uniquement aussi longtemps que nécessaire pour atteindre les objectifs décrits dans cette politique, sauf si une période de conservation plus longue est requise ou autorisée par la loi.
            </p>

            <h2 className="text-xl font-semibold mb-3">7. Modifications de Notre Politique</h2>
            <p className="text-(--muted-foreground) mb-3">
              Nous pouvons mettre à jour cette Politique de Confidentialité de temps en temps. La date de la dernière révision sera indiquée en haut de cette politique. Nous vous encourageons à la consulter périodiquement pour rester informé de la façon dont nous protégeons vos informations.
            </p>

            <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
            <p className="text-(--muted-foreground) mb-3">
              Si vous avez des questions concernant cette Politique de Confidentialité ou nos pratiques en matière de données, veuillez nous contacter à privacy@tontinepay.com ou par courrier à :
            </p>
            <p className="text-(--muted-foreground) mb-4">
              TontinePay<br />
              Service Protection des Données<br />
              Abidjan, Côte d'Ivoire
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Retour à l'accueil <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-(--border) py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-(--muted-foreground)">
          <p>© 2026 TontinePay. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-(--foreground)">CGU</Link>
            <Link href="/privacy" className="hover:text-(--foreground)">Confidentialité</Link>
            <Link href="/contact" className="hover:text-(--foreground)">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Import ArrowRight at the top
import { ArrowRight } from "lucide-react";