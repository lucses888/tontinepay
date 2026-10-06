import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import SettingsForm from "./settings-form";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return null;
  }

  async function updateUser(formData: FormData) {
    "use server";

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const emailNotifications = formData.get('emailNotifications') === 'on';
    const smsNotifications = formData.get('smsNotifications') === 'on';
    const marketingEmails = formData.get('marketingEmails') === 'on';

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        phone,
        preferences: {
          emailNotifications,
          smsNotifications,
          marketingEmails,
        },
      },
    });
  }

  const preferences = (user.preferences && typeof user.preferences === "object" && !Array.isArray(user.preferences)
    ? user.preferences as Record<string, unknown>
    : null) as {
      emailNotifications: boolean;
      smsNotifications: boolean;
      marketingEmails: boolean;
    } | null;

  return <SettingsForm
    user={{
      ...user,
      preferences,
    }}
    updateUser={updateUser}
  />;
}