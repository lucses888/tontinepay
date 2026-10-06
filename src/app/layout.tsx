import type { Metadata, Viewport } from "next";
import { Geist, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { RegisterSW } from "@/components/pwa/register-sw";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TontinePay — La tontine, moderne et sans stress",
    template: "%s | TontinePay",
  },
  description:
    "TontinePay digitalise vos tontines : cotisations Mobile Money, rappels automatiques, suivi transparent pour chaque membre. Conçu pour l'Afrique de l'Ouest.",
  keywords: ["tontine", "épargne", "mobile money", "cotisation", "afrique de l'ouest", "tontine en ligne"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TontinePay",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a7b44",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${geist.variable} ${bricolage.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased bg-(--background) text-(--foreground)">
        <Providers>
          {children}
          <RegisterSW />
        </Providers>
      </body>
    </html>
  );
}
