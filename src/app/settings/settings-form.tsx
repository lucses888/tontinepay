"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Loader2, Check, LogIn, ArrowRight, ArrowLeft } from "lucide-react";

interface SettingsFormProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    image: string | null;
    totalSaved: number;
    reliabilityScore: number;
    createdAt: Date | null;
    preferences: {
      emailNotifications: boolean;
      smsNotifications: boolean;
      marketingEmails: boolean;
    } | null;
  } | null;
  updateUser: (formData: FormData) => Promise<void>;
}

export default function SettingsForm({ user, updateUser }: SettingsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle the case where user is null (should not happen if passed from server component with checks)
  if (!user) {
    return null; // or redirect to login? But server component should handle auth.
  }

  // État du formulaire
  const [formValues, setFormValues] = useState({
    name: user.name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    emailNotifications: user.preferences?.emailNotifications ?? true,
    smsNotifications: user.preferences?.smsNotifications ?? true,
    marketingEmails: user.preferences?.marketingEmails ?? false,
  });

  const handleChange = (field: string, value: any) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setServerError("");
    setSuccessMessage("");

    try {
      await updateUser(new FormData(e.currentTarget));
      setSuccessMessage("Paramètres enregistrés avec succès !");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating user:", error);
      setServerError("Erreur lors de l'enregistrement des paramètres");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    // Rediriger vers une page de changement de mot de passe
    // Pour maintenant, nous allons simplement montrer un message
    alert("Fonctionnalité de changement de mot de passe à venir");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      setIsLoading(true);
      try {
        // Dans une vraie application, vous supprimeriez l'utilisateur et ses données liées
        // Pour maintenant, nous allons simplement déconnecter l'utilisateur
        await signOut({ callbackUrl: "/" });
      } catch (error) {
        console.error("Error deleting account:", error);
        setServerError("Erreur lors de la suppression du compte");
      } finally {
        setIsLoading(false);
      }
    }
  };

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

      {/* Profil utilisateur */}
      <div className="bg-(--card) rounded-xl border border-(--border) p-6">
        <h2 className="text-xl font-semibold mb-4">Profil</h2>
        <div className="space-y-5">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              {user.image ? (
                <img src={user.image} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-green-600 font-bold text-xl">
                  {user.name?.charAt(0) ?? "U"}
                </span>
              )}
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-lg">{user.name}</p>
              <p className="text-(--muted-foreground)">{user.email}</p>
              {user.phone && (
                <p className="text-(--muted-foreground)">📞 {user.phone}</p>
              )}
              {user.createdAt ? (
                <p className="text-(--muted-foreground) text-sm">
                  Membre depuis {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              ) : (
                <p className="text-(--muted-foreground) text-sm">
                  Date d'inscription inconnue
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-(--border)">
            <h3 className="font-semibold mb-3">Informations personnelles</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formValues.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Votre nom complet"
                  className="w-full px-4 py-2.5 rounded-lg border border-(--border) bg-(--card) focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:opacity-50"
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formValues.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="vous@exemple.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-(--border) bg-(--card) focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:opacity-50"
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formValues.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+225 XX XX XX XX"
                  className="w-full px-4 py-2.5 rounded-lg border border-(--border) bg-(--card) focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:opacity-50"
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Préférences de notification */}
      <div className="bg-(--card) rounded-xl border border-(--border) p-6">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <Check size={20} className="mt-0.5 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Emails de notification</h3>
                <p className="text-(--muted-foreground) text-sm">
                  Recevez des emails pour les activités importantes de votre compte
                </p>
              </div>
            </div>
            <label className="cursor-pointer flex items-start gap-3">
              <input
                type="checkbox"
                checked={formValues.emailNotifications}
                onChange={(e) => handleChange("emailNotifications", e.target.checked)}
                className="sr-only peer"
                disabled={isSaving}
              />
              <div className="w-10 h-6 bg-(--muted) peer-checked:bg-green-500 rounded-full transition-colors peer-disabled:opacity-50">
                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 peer-disabled:opacity-50"></div>
              </div>
            </label>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-1">
              <Check size={20} className="mt-0.5 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Notifications SMS</h3>
                <p className="text-(--muted-foreground) text-sm">
                  Recevez des rappels par SMS pour les cotisations à payer
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-1">
              <Check size={20} className="mt-0.5 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Emails promotionnels</h3>
                <p className="text-(--muted-foreground) text-sm">
                  Recevez des offres spéciales et des nouvelles de TontinePay
                </p>
              </div>
            </div>
            <label className="cursor-pointer flex items-start gap-3">
              <input
                type="checkbox"
                checked={formValues.marketingEmails}
                onChange={(e) => handleChange("marketingEmails", e.target.checked)}
                className="sr-only peer"
                disabled={isSaving}
              />
              <div className="w-10 h-6 bg-(--muted) peer-checked:bg-green-500 rounded-full transition-colors peer-disabled:opacity-50">
                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transaction-transform peer-checked:translate-x-4 peer-disabled:opacity-50"></div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Sécurité */}
      <div className="bg-(--card) rounded-xl border border-(--border) p-6">
        <h2 className="text-xl font-semibold mb-4">Sécurité</h2>
        <div className="space-y-4">
          <button
            onClick={handlePasswordChange}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-(--border) text-left text-sm font-medium hover:bg-(--muted) transition"
          >
            <span>Changer le mot de passe</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-(--border) text-left text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-600 transition"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Suppression en cours...
              </>
            ) : (
              <>
                <LogIn size={16} />
                Supprimer mon compte
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bouton d'enregistrement - wrapped in a form for proper handling */}
      <form onSubmit={handleSubmit} className="mt-6">
        {(!successMessage && !serverError) || (successMessage && !serverError) ? (
          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition"
          >
            {isSaving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Check size={18} />
            )}
            {isSaving ? "Enregistrement..." : "Enregistrer les paramètres"}
          </button>
        ) : (
          <>
            {serverError && (
              <div className="w-full rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 mb-4">
                {serverError}
              </div>
            )}
            {successMessage && (
              <div className="w-full rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600 mb-4">
                {successMessage}
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-lg border border-(--border) text-sm font-medium hover:bg-(--muted) transition"
              >
                {isSaving ? "Enregistrement..." : "Enregistrer les paramètres"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}