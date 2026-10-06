import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import SettingsForm from "./settings-form";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      image: true,
      createdAt: true,
      preferences: true,
    },
  });

  if (!user) redirect("/login");

  const prefs =
    user.preferences &&
    typeof user.preferences === "object" &&
    !Array.isArray(user.preferences)
      ? (user.preferences as Record<string, unknown>)
      : {};

  return (
    <SettingsForm
      user={{
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
        memberSince: user.createdAt.toISOString(),
        emailNotifications: prefs.emailNotifications !== false,
        smsNotifications: prefs.smsNotifications !== false,
        marketingEmails: prefs.marketingEmails === true,
      }}
    />
  );
}
