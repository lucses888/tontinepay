import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

// ─── Tailwind class merger ─────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Currency formatting (XOF - Franc CFA) ────────────────────────────────────
export function formatCurrency(
  amount: number,
  currency = "XOF",
  locale = "fr-FR"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Date formatting ───────────────────────────────────────────────────────────
export function formatDate(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy", { locale: fr });
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy à HH:mm", { locale: fr });
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
}

// ─── Phone formatting (West Africa) ───────────────────────────────────────────
export function formatPhone(phone: string): string {
  // Format: +225 XX XX XX XX XX (Côte d'Ivoire example)
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
  }
  return phone;
}

// ─── Slug generation ───────────────────────────────────────────────────────────
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[àáäâ]/g, "a")
    .replace(/[èéëê]/g, "e")
    .replace(/[ìíïî]/g, "i")
    .replace(/[òóöô]/g, "o")
    .replace(/[ùúüû]/g, "u")
    .replace(/[ñ]/g, "n")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ─── Percentage calculation ────────────────────────────────────────────────────
export function calculateProgress(collected: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(Math.round((collected / total) * 100), 100);
}

// ─── Commission calculation ────────────────────────────────────────────────────
export function calculateCommission(amount: number, rate = 0.01): number {
  return Math.round(amount * rate);
}

// ─── Cycle due date calculation ────────────────────────────────────────────────
export function calculateDueDate(
  startDate: Date,
  frequency: "WEEKLY" | "BIWEEKLY" | "MONTHLY"
): Date {
  const due = new Date(startDate);
  switch (frequency) {
    case "WEEKLY":
      due.setDate(due.getDate() + 7);
      break;
    case "BIWEEKLY":
      due.setDate(due.getDate() + 14);
      break;
    case "MONTHLY":
      due.setMonth(due.getMonth() + 1);
      break;
  }
  return due;
}

// ─── Truncate text ─────────────────────────────────────────────────────────────
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

// ─── Generate initials ─────────────────────────────────────────────────────────
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
