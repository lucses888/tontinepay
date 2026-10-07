import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Connexion",
};

const stats = [
  { value: "2 400+", label: "Tontines actives" },
  { value: "186 M", label: "FCFA cotisés" },
  { value: "94 %", label: "Cotisations à l'heure" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Panneau gauche — Marque */}
      <div className="relative hidden overflow-hidden bg-brand p-12 text-white lg:flex lg:flex-col lg:justify-between">
        {/* Texture d'arrière-plan */}
        <div aria-hidden className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white blur-2xl" />
          <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-white blur-2xl" />
          <div className="absolute top-1/2 right-0 h-40 w-40 translate-x-1/3 rounded-full bg-[#f2b705]/40 blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 font-display text-sm font-bold text-white backdrop-blur">
              TP
            </span>
            <span className="font-display text-2xl font-bold tracking-tight">
              Tontine<span className="text-[#f2b705]">Pay</span>
            </span>
          </Link>
        </div>

        {/* Contenu central */}
        <div className="relative z-10 space-y-6">
          <blockquote className="max-w-md font-display text-3xl font-semibold leading-snug">
            &laquo;&nbsp;La force du groupe au service de chacun — sans le cahier
            ni les relances.&nbsp;&raquo;
          </blockquote>
          <p className="max-w-md leading-relaxed text-white/70">
            Cotisations Mobile Money, rappels automatiques et comptes transparents
            pour chaque membre de votre tontine.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-white/15 pt-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-2xl font-bold">{stat.value}</p>
              <p className="mt-0.5 text-xs text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Panneau droit — Formulaire */}
      <div className="flex flex-col justify-center bg-white px-6 py-12 lg:px-16 xl:px-24">
        {/* Logo mobile */}
        <div className="mb-8 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand font-display text-sm font-bold text-white">
              TP
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-brand-ink">
              Tontine<span className="text-brand">Pay</span>
            </span>
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
}
