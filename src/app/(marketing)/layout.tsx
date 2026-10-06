import Link from "next/link";
import { auth } from "@/auth";
import { InstallButton } from "@/components/pwa/install-button";

const navLinks = [
  { href: "/fonctionnalites", label: "Fonctionnalités" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0d1f16]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a7b44] font-display text-sm font-bold text-white">
              TP
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Tontine<span className="text-[#0a7b44]">Pay</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-[#0d1f16]/70 transition hover:text-[#0d1f16]"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-[#0a7b44] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#065c33]"
              >
                Mon espace
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden px-3 py-2 text-sm font-medium text-[#0d1f16]/70 transition hover:text-[#0d1f16] sm:block"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-[#0a7b44] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#065c33]"
                >
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-[#f7f6f2]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a7b44] font-display text-sm font-bold text-white">
                  TP
                </span>
                <span className="font-display text-lg font-bold tracking-tight">
                  Tontine<span className="text-[#0a7b44]">Pay</span>
                </span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#0d1f16]/60">
                La tontine, moderne et sans stress. Cotisations Mobile Money,
                rappels automatiques et comptes transparents pour chaque membre.
              </p>
              <div className="mt-5">
                <InstallButton />
              </div>
              <p className="mt-6 text-sm text-[#0d1f16]/60">
                Abidjan, Côte d'Ivoire
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Produit</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-[#0d1f16]/60">
                <li><Link href="/fonctionnalites" className="transition hover:text-[#0a7b44]">Fonctionnalités</Link></li>
                <li><Link href="/tarifs" className="transition hover:text-[#0a7b44]">Tarifs</Link></li>
                <li><Link href="/register" className="transition hover:text-[#0a7b44]">Créer un compte</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Entreprise</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-[#0d1f16]/60">
                <li><Link href="/a-propos" className="transition hover:text-[#0a7b44]">À propos</Link></li>
                <li><Link href="/contact" className="transition hover:text-[#0a7b44]">Contact</Link></li>
                <li><Link href="/terms" className="transition hover:text-[#0a7b44]">CGU</Link></li>
                <li><Link href="/privacy" className="transition hover:text-[#0a7b44]">Confidentialité</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-black/5 pt-6">
            <p className="text-sm text-[#0d1f16]/50">
              © 2026 TontinePay. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
