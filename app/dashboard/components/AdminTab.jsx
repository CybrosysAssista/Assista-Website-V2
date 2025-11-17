"use client";

import { useEffect, useState } from "react";
import {
  useOpenRouterConfig,
  useSaveOpenRouterConfig,
  useOpenRouterProviders,
} from "../../hooks/useAdmin";

export default function AdminTab({ user }) {
  const roleValue = (user?.portal_role || user?.role || "").toLowerCase();

  const [openRouterKey, setOpenRouterKey] = useState("");
  const [savedOpenRouterKey, setSavedOpenRouterKey] = useState("");
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [openRouterMessage, setOpenRouterMessage] = useState(null);
  const [curlError, setCurlError] = useState(null);

  const [providersCount, setProvidersCount] = useState(0);

  // React Query hooks
  const {
    data: openRouterConfig,
    isLoading: isLoadingOpenRouter,
    error: openRouterConfigError,
  } = useOpenRouterConfig();
  const saveOpenRouterMutation = useSaveOpenRouterConfig();
  const {
    data: providersData,
    isLoading: isTestingProviders,
    error: providersError,
    refetch: refetchProviders,
  } = useOpenRouterProviders(openRouterKey);

  // Sync local state with React Query data
  useEffect(() => {
    if (openRouterConfig) {
      const apiKey = openRouterConfig.api_key || "";
      setOpenRouterKey(apiKey);
      setSavedOpenRouterKey(apiKey);
      // If no key is saved, allow editing immediately
      setIsEditingKey(!apiKey);
    }
  }, [openRouterConfig]);

  // Handle errors
  useEffect(() => {
    if (openRouterConfigError) {
      setOpenRouterMessage({
        type: "error",
        text:
          openRouterConfigError instanceof Error
            ? openRouterConfigError.message
            : "Unable to load OpenRouter configuration.",
      });
    }
  }, [openRouterConfigError]);

  // Handle providers data
  useEffect(() => {
    if (providersData) {
      if (Array.isArray(providersData?.data)) {
        setProvidersCount(providersData.data.length);
      } else {
        setProvidersCount(0);
      }
      setCurlError(null);
    }
  }, [providersData]);

  useEffect(() => {
    if (providersError) {
      setCurlError(
        providersError instanceof Error ? providersError.message : "Unable to fetch providers from OpenRouter."
      );
      setProvidersCount(0);
    }
  }, [providersError]);

  const handleEditKey = () => {
    setIsEditingKey(true);
    setOpenRouterMessage(null);
  };

  const handleCancelEdit = () => {
    setOpenRouterKey(savedOpenRouterKey);
    setIsEditingKey(false);
    setOpenRouterMessage(null);
  };

  const handleSaveOpenRouter = async () => {
    if (!openRouterKey.trim()) {
      setOpenRouterMessage({ type: "error", text: "Enter your OpenRouter API key before saving." });
      return;
    }

    setOpenRouterMessage(null);
    try {
      await saveOpenRouterMutation.mutateAsync({
        api_key: openRouterKey.trim(),
        price_limit: 25, // Default value, not shown in UI
      });
      setSavedOpenRouterKey(openRouterKey.trim());
      setIsEditingKey(false);
      setOpenRouterMessage({ type: "success", text: "OpenRouter master key saved." });
    } catch (error) {
      setOpenRouterMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to save OpenRouter key. Please try again.",
      });
    }
  };

  const hasChanges = openRouterKey.trim() !== savedOpenRouterKey.trim();

  const handleFetchProviders = () => {
    if (!openRouterKey.trim()) {
      setCurlError("Save your OpenRouter master key first.");
      setProvidersCount(0);
      return;
    }
    setCurlError(null);
    refetchProviders();
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">OpenRouter Master Key</h2>
        <p className="mt-2 text-sm text-gray-600">
          Store the shared OpenRouter API key once. Provisioned customer keys reference this master key.
        </p>

        <div className="mt-6">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Master API Key</label>
          <input
            type="text"
            value={openRouterKey}
            onChange={(event) => setOpenRouterKey(event.target.value)}
            disabled={!isEditingKey}
            placeholder="sk-or-..."
            className={`mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none ${
              !isEditingKey ? "bg-gray-50 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          {!isEditingKey ? (
            <>
              <button
                type="button"
                onClick={handleEditKey}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
              >
                Edit
              </button>
              {openRouterMessage && (
                <span
                  className={`text-sm ${
                    openRouterMessage.type === "success" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {openRouterMessage.text}
                </span>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSaveOpenRouter}
                disabled={saveOpenRouterMutation.isPending || !hasChanges}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saveOpenRouterMutation.isPending ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saveOpenRouterMutation.isPending}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              {openRouterMessage && (
                <span
                  className={`text-sm ${
                    openRouterMessage.type === "success" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {openRouterMessage.text}
                </span>
              )}
            </>
          )}
        </div>

        {isLoadingOpenRouter && (
          <p className="mt-2 text-xs text-gray-500">Loading saved OpenRouter configuration…</p>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Test OpenRouter Providers</h2>
        <p className="mt-2 text-sm text-gray-600">
          Use your stored OpenRouter key to fetch available providers directly from OpenRouter.
        </p>

        <button
          type="button"
          onClick={handleFetchProviders}
          disabled={isTestingProviders || !openRouterKey.trim()}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isTestingProviders ? "Fetching…" : "Fetch Providers"}
        </button>

        {/* Test Results */}
        <div className="mt-4">
          {isTestingProviders ? (
            <p className="text-sm text-gray-500">Testing connection...</p>
          ) : curlError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">Test Failed</p>
              <p className="mt-1 text-sm text-red-600">{curlError}</p>
            </div>
          ) : providersCount > 0 ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-800">Test Successful</p>
              <p className="mt-1 text-sm text-emerald-700">
                Total providers found: <span className="font-semibold">{providersCount}</span>
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Audit Info</p>
        <div className="mt-2 space-y-1 text-sm text-gray-600">
          <p>
            <span className="font-medium text-gray-900">Signed in as:</span> {user?.email || "Unknown"}
          </p>
          <p>
            <span className="font-medium text-gray-900">Role:</span> {userRoleLabel(roleValue)}
          </p>
          <p className="text-xs text-gray-500">
            Admin tools let you manage master keys and provisioning defaults shared across the workspace.
          </p>
        </div>
      </section>
    </div>
  );
}

function userRoleLabel(role) {
  if (!role) {
    return "Not supplied";
  }
  return role.charAt(0).toUpperCase() + role.slice(1);
}
