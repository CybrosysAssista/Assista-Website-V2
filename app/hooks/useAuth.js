"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { API_BASE_URL, AUTH_API_URL } from "../config/api";

/**
 * Register a new user
 */
export function useRegister() {
  return useMutation({
    mutationFn: async ({ email, password, name }) => {
      const response = await fetch(`${AUTH_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: name?.trim() || undefined,
        }),
      });

      if (!response.ok) {
        let message = await response.text();
        try {
          const parsed = JSON.parse(message);
          message = parsed?.detail || message;
        } catch {
          // ignore parse errors
        }
        throw new Error(message || `Failed with status ${response.status}`);
      }

      return response.json();
    },
  });
}

/**
 * Sync user with backend
 */
export function useSyncUser() {
  return useMutation({
    mutationFn: async (user) => {
      if (!user?.email) {
        return null;
      }

      const response = await fetch(`${AUTH_API_URL}/api/users`, {
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

      if (!response.ok) {
        throw new Error(`Failed to sync user: ${response.status}`);
      }

      return response.json();
    },
  });
}

/**
 * Fetch user from backend
 */
export function useUser(email) {
  return useQuery({
    queryKey: ["user", email],
    queryFn: async () => {
      if (!email) return null;

      const response = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(email)}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!email,
  });
}

