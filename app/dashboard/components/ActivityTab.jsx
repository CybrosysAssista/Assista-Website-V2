"use client";

import { useMemo } from "react";
import { useKeyUsage } from "../../hooks/useKeyUsage";

export default function ActivityTab({ user }) {
  const userEmail = useMemo(() => user?.portal_email || user?.email || "", [user]);

  // Fetch individual key usage using React Query
  const {
    data: keyUsage,
    isLoading: isLoadingUsage,
    error: usageError,
  } = useKeyUsage(userEmail);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Key Usage</h2>
        <p className="mt-1 text-sm text-gray-500">
          Detailed usage information for your API key.
        </p>
      </div>

      {/* Individual Key Usage */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Individual Key Usage</h3>
        {isLoadingUsage ? (
          <p className="text-sm text-gray-500">Loading key usage...</p>
        ) : usageError ? (
          <p className="text-sm text-red-500">
            {usageError instanceof Error ? usageError.message : "Unable to load key usage data."}
          </p>
        ) : keyUsage ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Total Usage</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {keyUsage.usage !== null && keyUsage.usage !== undefined
                    ? keyUsage.usage.toFixed(2)
                    : "—"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Limit: {keyUsage.limit !== null && keyUsage.limit !== undefined ? keyUsage.limit : "—"}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Daily Usage</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {keyUsage.usage_daily !== null && keyUsage.usage_daily !== undefined
                    ? keyUsage.usage_daily.toFixed(2)
                    : "—"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Remaining:{" "}
                  {keyUsage.limit_remaining !== null && keyUsage.limit_remaining !== undefined
                    ? keyUsage.limit_remaining.toFixed(2)
                    : "—"}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Weekly Usage</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {keyUsage.usage_weekly !== null && keyUsage.usage_weekly !== undefined
                    ? keyUsage.usage_weekly.toFixed(2)
                    : "—"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Reset: {keyUsage.limit_reset || "—"}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Monthly Usage</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {keyUsage.usage_monthly !== null && keyUsage.usage_monthly !== undefined
                    ? keyUsage.usage_monthly.toFixed(2)
                    : "—"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  BYOK:{" "}
                  {keyUsage.byok_usage !== null && keyUsage.byok_usage !== undefined
                    ? keyUsage.byok_usage.toFixed(2)
                    : "—"}
                </p>
              </div>
            </div>
          ) : (
          <p className="text-sm text-gray-500">No key usage data available.</p>
        )}
        
      </div>
    </div>
  );
}

