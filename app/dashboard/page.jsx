import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authConfig } from "@/auth.config";
import DashboardClient from "./DashboardClient";
import { API_BASE_URL } from "../config/api";

async function syncUser(user) {
  if (!user?.email) {
    return null;
  }

  try {
    await fetch(`${API_BASE_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        name: user.name ?? "",
        image: user.image ?? "",
        provider: user.provider ?? "web",
        portal_role: user.portal_role ?? user.role ?? undefined,
      }),
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to synchronise user with backend:", error);
  }

  return null;
}

async function fetchUserFromBackend(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(email)}`, {
      cache: "no-store",
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch user from backend:", error);
  }

  return null;
}

export default async function DashboardPage() {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    redirect("/signin?callbackUrl=/dashboard");
  }

  // Sync user first to ensure they exist in the backend
  await syncUser(session.user);

  // Fetch the latest user data from the backend
  const backendUser = await fetchUserFromBackend(session.user.email);

  // Merge backend data with session data (backend takes precedence for name)
  const user = {
    ...session.user,
    ...(backendUser && {
      name: backendUser.name,
      image: backendUser.image || session.user.image,
      provider: backendUser.provider || session.user.provider,
      portal_role: backendUser.portal_role || session.user.portal_role,
      role: backendUser.role || session.user.role,
    }),
  };

  return <DashboardClient user={user} />;
}

