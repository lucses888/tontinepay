"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signOut } from "next-auth/react";
import { ArrowLeft, Check, Loader2, LogOut, KeyRound } from "lucide-react";
import { updateProfile, changePassword, type ActionState } from "./actions";

interface SettingsFormProps {
  user: {
    name: string | null;
    email: string;
    phone: string | null;
    image: string | null;
    memberSince: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
  };
}

const initialState: ActionState = { ok: false, message: "" };

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-(--border) bg-(--card) focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:opacity-50";

function Feedback({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <div
      role="status"
      className={`rounded-lg border px-4 py-3 text-sm ${
        state.ok
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-red-50 border-red-200 text-red-600"
      }`}
    >
      {state.message}
    </div>
  );
}

function Toggle({
  name,
  label,
  description,
  defaultChecked,
  disabled,
}: {
  name: string;
  label: string;
  description: string;
  defaultChecked: boolean;
  disabled: boolean;
}) {
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer">
      <div className="flex-1">
        <h3 className="font-semibold mb-1">{label}</h3>
        <p className="text-(--muted-foreground) text-sm">{description}</p>
      </div>
      <span className="relative inline-flex shrink-0 items-center mt-1">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          disabled={disabled}
          className="peer sr-only"
        />
        <span className="h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-green-500 peer-disabled:opacity-50 peer-focus-visible:ring-2 peer-focus-visible:ring-green-500" />
        <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const [profileState, profileAction, profilePending] = useActionState(
    updateProfile,
    initialState
  );
  const [passwordState, passwordAction, passwordPending] = useActionState(
    changePassword,
    initialState
  );

  const initial = (user.name ?? user.email).charAt(0).toUpperCase();

  return (
    <div className="space-y-6 max-w-2xl">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-(--border) hover:bg-(--muted) transition"
        >
          <ArrowLeft size={20} />
          Retour
        </Link>
        <h1 className="text-2xl font-bold">Paramètres</h1>
      </div>

      {/* Profil + notifications : un seul formulaire */}
      <form action={profileAction} className="space-y-6">
        <div className="bg-(--card) rounded-xl border border-(--border) p-6">
          <h2 className="text-xl font-semibold mb-4">Profil</h2>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center overflow-hidden shrink-0">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-green-600 font-bold text-xl">{initial}</span>
              )}
            </div>
            <p className="text-(--muted-foreground) text-sm">
              Membre depuis{" "}
              {new Date(user.memberSince).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={user.name ?? ""}
                placeholder="Votre nom complet"
                required
                disabled={profilePending}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
                placeholder="vous@exemple.com"
                required
                disabled={profilePending}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
                Téléphone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={user.phone ?? ""}
                placeholder="+225 07 XX XX XX XX"
                disabled={profilePending}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="bg-(--card) rounded-xl border border-(--border) p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-5">
            <Toggle
              name="emailNotifications"
              label="Emails de notification"
              description="Recevez des emails pour les activités importantes de votre compte"
              defaultChecked={user.emailNotifications}
              disabled={profilePending}
            />
            <Toggle
              name="smsNotifications"
              label="Notifications SMS"
              description="Recevez des rappels par SMS pour les cotisations à payer"
              defaultChecked={user.smsNotifications}
              disabled={profilePending}
            />
            <Toggle
              name="marketingEmails"
              label="Emails promotionnels"
              description="Recevez des offres spéciales et des nouvelles de TontinePay"
              defaultChecked={user.marketingEmails}
              disabled={profilePending}
            />
          </div>
        </div>

        <Feedback state={profileState} />

        <button
          type="submit"
          disabled={profilePending}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition"
        >
          {profilePending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Check size={18} />
          )}
          {profilePending ? "Enregistrement..." : "Enregistrer les paramètres"}
        </button>
      </form>

      {/* Sécurité : changement de mot de passe */}
      <form
        action={passwordAction}
        className="bg-(--card) rounded-xl border border-(--border) p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold">Sécurité</h2>

        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium mb-1.5">
            Mot de passe actuel
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            disabled={passwordPending}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium mb-1.5">
            Nouveau mot de passe
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
            disabled={passwordPending}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-(--muted-foreground)">
            8 caractères minimum, une majuscule et un chiffre
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
            Confirmer le nouveau mot de passe
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            disabled={passwordPending}
            className={inputClass}
          />
        </div>

        <Feedback state={passwordState} />

        <button
          type="submit"
          disabled={passwordPending}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-(--border) text-sm font-medium hover:bg-(--muted) disabled:opacity-60 transition"
        >
          {passwordPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <KeyRound size={16} />
          )}
          Changer le mot de passe
        </button>
      </form>

      {/* Session */}
      <div className="bg-(--card) rounded-xl border border-(--border) p-6">
        <h2 className="text-xl font-semibold mb-4">Session</h2>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-(--border) text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={16} />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
