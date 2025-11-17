"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "../config/api";

/**
 * Fetch user sessions
 */
export function useSessions(userEmail) {
  return useQuery({
    queryKey: ["sessions", userEmail],
    queryFn: async () => {
      if (!userEmail) return [];

      const response = await fetch(
        `${API_BASE_URL}/auth/sessions?user_email=${encodeURIComponent(userEmail)}`
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    enabled: !!userEmail,
  });
}

/**
 * Revoke a session
 */
export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, userEmail }) => {
      const response = await fetch(`${API_BASE_URL}/auth/sessions/${sessionId}/revoke`, {
        method: "POST",
      });

      if (!response.ok) {
        let detail = await response.text();
        try {
          const parsed = JSON.parse(detail);
          detail = parsed?.detail || detail;
        } catch (parseError) {
          // ignore parse errors
        }
        throw new Error(detail || `Failed with status ${response.status}`);
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch sessions
      queryClient.invalidateQueries({ queryKey: ["sessions", variables.userEmail] });
    },
  });
}

