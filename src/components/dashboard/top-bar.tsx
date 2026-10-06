"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search, X } from "lucide-react";
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

interface TopBarProps {
  user: Session["user"];
  unreadCount?: number;
}

export function TopBar({ user, unreadCount = 0 }: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const pageTitles: Record<string, string> = {
    "/dashboard": "Tableau de bord",
    "/tontines": "Mes tontines",
    "/tontines/new": "Nouvelle tontine",
    "/wallet": "Portefeuille",
    "/notifications": "Notifications",
    "/settings": "Paramètres",
  };
  const pageTitle = pageTitles[pathname] ?? "TontinePay";

  return (
    <>
      <header className="h-16 bg-(--card) border-b border-(--border) flex items-center justify-between px-4 md:px-6 shrink-0">
        {/* Mobile menu button + page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-(--muted) text-(--muted-foreground)"
          >
            <Menu size={20} />
          </button>
          <h1 className="font-semibold text-lg">{pageTitle}</h1>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Link
            href="/notifications"
            className="relative p-2 rounded-lg hover:bg-(--muted) text-(--muted-foreground) transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </Link>

          {/* Avatar (mobile) */}
          <div className="lg:hidden w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold text-sm">
            {getInitials(user?.name ?? "U")}
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="relative w-72 bg-(--card) h-full flex flex-col shadow-xl">
            {/* Header */}
            <div className="p-5 border-b border-(--border) flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2">
                <span className="text-2xl">🤝</span>
                <span className="font-bold text-lg">TontinePay</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg hover:bg-(--muted)">
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                      isActive
                        ? "bg-green-50 text-green-700"
                        : "text-(--muted-foreground) hover:bg-(--muted)"
                    )}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                );
              })}

              <Link
                href="/tontines/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-green-600 text-white mt-4"
              >
                <PlusCircle size={18} />
                Créer une tontine
              </Link>
            </nav>

            {/* User */}
            <div className="p-4 border-t border-(--border)">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold">
                  {getInitials(user?.name ?? "U")}
                </div>
                <div>
                  <p className="font-semibold text-sm">{user?.name}</p>
                  <p className="text-xs text-(--muted-foreground)">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium"
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
