import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Panneau gauche — Illustration */}
      <div className="hidden lg:flex flex-col justify-between bg-green-600 p-12 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white -translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
              🤝
            </div>
            <span className="text-2xl font-bold">TontinePay</span>
          </Link>
        </div>

        {/* Contenu central */}
        <div className="relative z-10 space-y-6">
          <blockquote className="text-2xl font-semibold leading-relaxed">
            &ldquo;Ensemble, nous épargnons mieux. La force du groupe au service de chacun.&rdquo;
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <p className="font-semibold">Mamadou Diallo</p>
              <p className="text-green-200 text-sm">Membre depuis 2 ans · 6 tontines complétées</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: "10K+", label: "Membres actifs" },
            { value: "500+", label: "Tontines actives" },
            { value: "99%", label: "Taux de ponctualité" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-green-200 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Panneau droit — Formulaire */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
        {/* Logo mobile */}
        <div className="lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🤝</span>
            <span className="text-xl font-bold text-green-600">TontinePay</span>
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
}
