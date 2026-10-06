"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallButton({ variant = "primary" }: { variant?: "primary" | "ghost" }) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Déjà installée en mode standalone ?
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        // iOS Safari
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );

    // Détection iOS pour afficher les instructions « Ajouter à l'écran d'accueil »
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIos(
      /iphone|ipad|ipod/.test(ua) ||
        (/macintosh/.test(ua) && "ontouchend" in document)
    );

    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  // App déjà installée : ne rien afficher
  if (isStandalone) return null;

  const handleClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  // iOS : pas de beforeinstallprompt, on guide l'utilisateur
  if (isIos && !deferredPrompt) {
    return (
      <p className="flex items-center justify-center gap-2 text-sm text-[#0d1f16]/60">
        <Smartphone size={15} />
        Sur iPhone : bouton Partager, puis « Sur l'écran d'accueil ».
      </p>
    );
  }

  if (!deferredPrompt) return null;

  return (
    <button
      onClick={handleClick}
      className={
        variant === "primary"
          ? "btn-brand"
          : "inline-flex items-center gap-2 rounded-lg border border-white/25 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
      }
    >
      <Download size={16} />
      Installer l'application
    </button>
  );
}
