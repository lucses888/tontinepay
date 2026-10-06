import Link from "next/link";
import type { Metadata } from "next";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Hors ligne",
  robots: { index: false },
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0a7b44]/10">
        <WifiOff size={28} className="text-[#0a7b44]" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">
        Vous êtes hors ligne
      </h1>
      <p className="mt-3 max-w-md leading-relaxed text-[#0d1f16]/70">
        Impossible de charger cette page sans connexion. Vérifiez votre réseau
        Mobile Money ou votre Wi-Fi, puis réessayez — vos tontines vous
        attendent.
      </p>
      <Link href="/" className="btn-brand mt-8">
        Réessayer
      </Link>
    </div>
  );
}
