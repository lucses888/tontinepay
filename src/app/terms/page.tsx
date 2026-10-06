import Link from "next/link";

export default function TermsPage() {
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
            Conditions Générales d'Utilisation
          </h1>

          <div className="bg-(--card) rounded-xl border border-(--border) p-8 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-(--muted-foreground) mb-4">
              Bienvenue sur TontinePay ("nous", "notre", "TontinePay"). Ces Conditions Générales d'Utilisation ("Conditions") régissent votre accès et votre utilisation de notre application web et mobile. En accédant ou en utilisant TontinePay, vous acceptez d'être lié par ces Conditions. Si vous n'acceptez pas ces Conditions, veuillez ne pas utiliser notre application.
            </p>

            <h2 className="text-xl font-semibold mb-3">1. Acceptation des Conditions</h2>
            <p className="text-(--muted-foreground) mb-3">
              En créant un compte ou en utilisant TontinePay, vous confirmez que vous avez lu, compris et accepté ces Conditions, ainsi que notre Politique de Confidentialité. Ces Conditions constituent un accord légalement contraignant entre vous et TontinePay.
            </p>

            <h2 className="text-xl font-semibold mb-3">2. Description du Service</h2>
            <p className="text-(--muted-foreground) mb-3">
              TontinePay est une plateforme digitale permettant de gérer des tontines (groupes d'épargne) de manière sécurisée et transparente. Notre service facilite la création, la gestion et le suivi des tontines, incluant les cotisations, les versements et les communications entre membres.
            </p>

            <h2 className="text-xl font-semibold mb-3">3. Comptes Utilisateurs</h2>
            <p className="text-(--muted-foreground) mb-3">
              Pour utiliser certaines fonctionnalités de TontinePay, vous devez créer un compte. Vous êtes responsable du maintien de la confidentialité de votre mot de passe et de toutes les activités qui se produisent sous votre compte. Vous acceptez de nous notifier immédiatement toute utilisation non autorisée de votre compte.
            </p>

            <h2 className="text-xl font-semibold mb-3">4. Cotisations et Paiements</h2>
            <p className="text-(--muted-foreground) mb-3">
              Les cotisations sont effectuées via Mobile Money (Orange Money, MTN MoMo, Wave) ou autres méthodes de paiement soutenues. TontinePay agit en tant qu'intermédiaire pour faciliter ces transactions mais ne détient pas les fonds des utilisateurs. Nous ne sommes pas responsables des retards ou échecs de paiement provenant des fournisseurs de services de paiement.
            </p>

            <h2 className="text-xl font-semibold mb-3">5. Responsabilité</h2>
            <p className="text-(--muted-foreground) mb-3">
              TontinePay ne sera pas responsable des dommages indirects, accessoires, spéciaux ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser notre service. Notre responsabilité totale envers vous pour toute réclamation ne dépassera pas le montant que vous nous avez payé, le cas échéant, au cours des six (6) mois précédant la réclamation.
            </p>

            <h2 className="text-xl font-semibold mb-3">6. Modifications des Conditions</h2>
            <p className="text-(--muted-foreground) mb-3">
              Nous nous réservons le droit de modifier ces Conditions à tout moment. Les modifications prendront effet dès leur publication sur l'application. Votre utilisation continue de TontinePay après de telles modifications constitue votre acceptation des nouvelles Conditions.
            </p>

            <h2 className="text-xl font-semibold mb-3">7. Loi Applicable et Juridiction</h2>
            <p className="text-(--muted-foreground) mb-3">
              Ces Conditions sont régies et interprétées conformément aux lois de la Côte d'Ivoire, sans égard à ses principes de conflit de lois. Tout litige découlant de ou lié à ces Conditions sera soumis à la compétence exclusive des tribunaux situés en Côte d'Ivoire.
            </p>

            <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
            <p className="text-(--muted-foreground) mb-3">
              Si vous avez des questions concernant ces Conditions, veuillez nous contacter à travers notre formulaire de contact ou par email à legal@tontinepay.com.
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