"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Users, Wallet, Settings, LogOut, PlusCircle,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import type { Session } from "next-auth";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/tontines", label: "Mes tontines", icon: Users },
  { href: "/wallet", label: "Portefeuille", icon: Wallet },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Paramètres", icon: Settings },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/tontines": "Mes tontines",
  "/tontines/new": "Nouvelle tontine",
  "/tontines/join": "Rejoindre une tontine",
  "/wallet": "Portefeuille",
  "/notifications": "Notifications",
  "/settings": "Paramètres",
};

interface TopBarProps {
  user: Session["user"];
  unreadCount?: number;
}

export function TopBar({ user, unreadCount = 0 }: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const pageTitle = pageTitles[pathname] ?? "TontinePay";

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-(--border) bg-white px-4 md:px-6">
        {/* Menu mobile + titre de page */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-(--muted) lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu size={20} />
          </button>
          {/* Logo mobile */}
          <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand font-display text-[11px] font-bold text-white">
              TP
            </span>
          </Link>
          <h1 className="font-display text-lg font-bold tracking-tight">{pageTitle}</h1>
        </div>

        {/* Actions droite */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Link
            href="/notifications"
            className="relative rounded-lg p-2 text-(--muted-foreground) transition-colors hover:bg-(--muted)"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          {/* Avatar (mobile) */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft font-semibold text-sm text-brand-deep lg:hidden">
            {getInitials(user?.name ?? "U")}
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#0d1f16]/40 backdrop-blur-[2px]"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="relative flex h-full w-72 flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-(--border) p-5">
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand font-display text-sm font-bold text-white">
                  TP
                </span>
                <span className="font-display text-lg font-bold tracking-tight">
                  Tontine<span className="text-brand">Pay</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1 transition hover:bg-(--muted)"
                aria-label="Fermer le menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-brand-soft font-semibold text-brand-deep"
                        : "text-(--muted-foreground) hover:bg-(--muted)"
                    )}
                  >
                    <Icon size={18} className={isActive ? "text-brand" : undefined} />
                    {label}
                  </Link>
                );
              })}

              <Link
                href="/tontines/new"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary mt-4 w-full"
              >
                <PlusCircle size={18} />
                Créer une tontine
              </Link>
            </nav>

            {/* Utilisateur */}
            <div className="border-t border-(--border) p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft font-semibold text-brand-deep">
                  {getInitials(user?.name ?? "U")}
                </div>
                <div>
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-(--muted-foreground)">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-2 text-sm font-medium text-red-500 transition hover:text-red-600"
              >
                <LogOut size={15} />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
