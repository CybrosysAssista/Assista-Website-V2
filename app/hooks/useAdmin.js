"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "../config/api";

/**
 * Fetch OpenRouter configuration
 */
export function useOpenRouterConfig() {
  return useQuery({
    queryKey: ["openRouterConfig"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/admin/openrouter`);

      if (!response.ok) {
        let detail = await response.text();
        try {
          const parsed = JSON.parse(detail);
          detail = parsed?.detail || detail;
        } catch {
          // ignore parse errors
        }
        throw new Error(detail || `Failed with status ${response.status}`);
      }

      return response.json();
    },
  });
}

/**
 * Save OpenRouter configuration
 */
export function useSaveOpenRouterConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ api_key, price_limit }) => {
      const response = await fetch(`${API_BASE_URL}/admin/openrouter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: api_key.trim(),
          price_limit,
        }),
      });

      if (!response.ok) {
        let detail = await response.text();
        try {
          const parsed = JSON.parse(detail);
          detail = parsed?.detail || detail;
        } catch {
          // ignore parse errors
        }
        throw new Error(detail || `Failed with status ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["openRouterConfig"] });
    },
  });
}

/**
 * Fetch OpenRouter providers
 */
export function useOpenRouterProviders(masterKey) {
  return useQuery({
    queryKey: ["openRouterProviders", masterKey],
    queryFn: async () => {
      if (!masterKey?.trim()) {
        throw new Error("OpenRouter master key is required");
      }

      const response = await fetch("https://openrouter.ai/api/v1/providers", {
        headers: {
          Authorization: `Bearer ${masterKey.trim()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let detail = await response.text();
        try {
          const parsed = JSON.parse(detail);
          detail = parsed?.detail || parsed?.message || detail;
        } catch {
          // ignore parse errors
        }
        throw new Error(detail || `Failed with status ${response.status}`);
      }

      return response.json();
    },
    enabled: !!masterKey?.trim(),
  });
}

/**
 * Provision a new OpenRouter key (admin)
 */
export function useProvisionOpenRouterKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, limit, limit_reset, include_byok_in_limit, expires_at }) => {
      const response = await fetch(`${API_BASE_URL}/admin/openrouter/keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          limit,
          limit_reset,
          include_byok_in_limit,
          expires_at: expires_at ? new Date(expires_at).toISOString() : null,
        }),
      });

      if (!response.ok) {
        let detail = await response.text();
        try {
          const parsed = JSON.parse(detail);
          detail = parsed?.detail || detail;
        } catch {
          // ignore parse errors
        }
        throw new Error(detail || `Failed with status ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["openRouterConfig"] });
    },
  });
}

/**
 * Save provider configuration
 */
export function useSaveProviderConfig() {
  return useMutation({
    mutationFn: async ({ provider, api_key }) => {
      const response = await fetch(`${API_BASE_URL}/admin/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ai_providers: {
            [provider]: {
              enabled: true,
              api_key: api_key.trim(),
            },
          },
        }),
      });

      if (!response.ok) {
        let detail = await response.text();
        try {
          const parsed = JSON.parse(detail);
          detail = parsed?.detail || detail;
        } catch {
          // ignore parse errors
        }
        throw new Error(detail || `Failed with status ${response.status}`);
      }

      return response.json();
    },
  });
}

