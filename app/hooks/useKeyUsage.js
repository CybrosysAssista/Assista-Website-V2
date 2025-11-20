"use client";

import { useQuery } from "@tanstack/react-query";
import { NEXT_PUBLIC_API_URL } from "../config/api";

/**
 * Fetch key usage stats for a specific record ID
 */
export function useKeyStats(recordId) {
  return useQuery({
    queryKey: ["keyStats", recordId],
    queryFn: async () => {
      if (!recordId) return null;

      const response = await fetch(`${NEXT_PUBLIC_API_URL}/admin/openrouter/keys/${recordId}/stats`);

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    enabled: !!recordId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Fetch individual key usage by user email
 */
export function useKeyUsage(userEmail) {
  return useQuery({
    queryKey: ["keyUsage", userEmail],
    queryFn: async () => {
      if (!userEmail) return null;

      const response = await fetch(
        `${API_BASE_URL}/admin/openrouter/keys/usage?user_email=${encodeURIComponent(userEmail)}`
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    enabled: !!userEmail,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

