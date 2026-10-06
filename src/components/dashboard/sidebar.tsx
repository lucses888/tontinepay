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
  HandshakeIcon,
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
    <aside className="hidden lg:flex flex-col w-64 bg-(--card) border-r border-(--border) h-full">
      {/* Logo */}
      <div className="p-6 border-b border-(--border)">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center text-white text-lg">
            🤝
          </div>
          <span className="font-bold text-lg">TontinePay</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                  : "text-(--muted-foreground) hover:bg-(--muted) hover:text-(--foreground)"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}

        {/* CTA Créer */}
        <div className="pt-4">
          <Link
            href="/tontines/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            <PlusCircle size={18} />
            Créer une tontine
          </Link>
        </div>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-(--border)">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold text-sm shrink-0">
            {user?.image ? (
              <img src={user.image} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              getInitials(user?.name ?? user?.email ?? "U")
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-(--muted-foreground) truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-(--muted-foreground) hover:text-red-500 transition-colors p-1"
            title="Déconnexion"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
