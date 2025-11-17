"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "../config/api";

/**
 * Fetch user's API keys
 */
export function useApiKeys(userEmail) {
  return useQuery({
    queryKey: ["apiKeys", userEmail],
    queryFn: async () => {
      if (!userEmail) return [];

      const response = await fetch(
        `${API_BASE_URL}/admin/openrouter/keys?user_email=${encodeURIComponent(userEmail)}`
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const keys = await response.json();
      if (Array.isArray(keys)) {
        return keys.map(({ key: _omitKey, ...rest }) => rest);
      }
      return [];
    },
    enabled: !!userEmail,
  });
}

/**
 * Create a new API key
 */
export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, userEmail }) => {
      const response = await fetch(`${API_BASE_URL}/admin/openrouter/keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      // Invalidate and refetch API keys
      queryClient.invalidateQueries({ queryKey: ["apiKeys", variables.userEmail] });
      // Also invalidate key usage if needed
      queryClient.invalidateQueries({ queryKey: ["keyUsage", variables.userEmail] });
    },
  });
}

/**
 * Delete an API key
 */
export function useDeleteApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recordId, userEmail }) => {
      const response = await fetch(`${API_BASE_URL}/admin/openrouter/keys/${recordId}`, {
        method: "DELETE",
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
      // Invalidate and refetch API keys
      queryClient.invalidateQueries({ queryKey: ["apiKeys", variables.userEmail] });
      // Also invalidate key usage
      queryClient.invalidateQueries({ queryKey: ["keyUsage", variables.userEmail] });
    },
  });
}

