"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Bell,
  Settings,
  LogOut,
  PlusCircle,
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

interface SidebarProps {
  user: Session["user"];
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-full w-64 flex-col border-r border-(--border) bg-white lg:flex">
      {/* Logo */}
      <div className="border-b border-(--border) p-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand font-display text-sm font-bold text-white">
            TP
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Tontine<span className="text-brand">Pay</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-soft font-semibold text-brand-deep"
                  : "text-(--muted-foreground) hover:bg-(--muted) hover:text-(--foreground)"
              )}
            >
              <Icon size={18} className={isActive ? "text-brand" : undefined} />
              {label}
            </Link>
          );
        })}

        {/* CTA Créer */}
        <div className="pt-4">
          <Link href="/tontines/new" className="btn-primary w-full">
            <PlusCircle size={18} />
            Créer une tontine
          </Link>
        </div>
      </nav>

      {/* Section utilisateur */}
      <div className="border-t border-(--border) p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft font-semibold text-sm text-brand-deep">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              getInitials(user?.name ?? user?.email ?? "U")
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-(--muted-foreground)">{user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-1 text-(--muted-foreground) transition-colors hover:text-red-500"
            title="Déconnexion"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
