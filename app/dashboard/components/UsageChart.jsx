"use client";

export default function UsageChart({ stats, isLoading, planName, error }) {
  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-sm text-red-500">
          {error instanceof Error ? error.message : typeof error === "string" ? error : "Unable to load usage data."}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-sm text-gray-500">Loading usage…</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-medium text-gray-800">No usage data yet</p>
        <p className="text-sm text-gray-500">
          Activate a plan to start tracking real-time consumption from your provider.
        </p>
      </div>
    );
  }

  const limit = typeof stats.limit === "number" ? stats.limit : null;
  const usage = typeof stats.usage === "number" ? stats.usage : null;
  const remaining = limit !== null && usage !== null ? Math.max(limit - usage, 0) : null;
  const percentUsed = limit && usage !== null ? Math.min((usage / limit) * 100, 100) : null;

  const segments = [
    {
      label: "Total Usage",
      value: usage,
      helper: usage !== null && limit ? `${percentUsed?.toFixed(1)}% of limit` : null,
    },
    {
      label: "Remaining",
      value: remaining,
      helper: stats.limit_remaining !== undefined ? `${stats.limit_remaining}` : null,
    },
    {
      label: "BYOK Usage",
      value: typeof stats.byok_usage === "number" ? stats.byok_usage : null,
      helper:
        stats.byok_usage_daily !== undefined && stats.byok_usage_weekly !== undefined
          ? `Daily ${stats.byok_usage_daily ?? "—"} • Weekly ${stats.byok_usage_weekly ?? "—"}`
          : null,
    },
  ];

  const renderValue = (value) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "number") {
      return value % 1 === 0 ? value : value.toFixed(2);
    }
    return value;
  };

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="flex flex-1 items-center justify-center">
        <div className="relative h-48 w-48">
          <div
            className="h-full w-full rounded-full"
            style={{
              background: percentUsed !== null
                ? `conic-gradient(#3b82f6 ${percentUsed}%, #e5e7eb ${percentUsed}% 100%)`
                : "#e5e7eb",
              transition: "background 0.6s ease",
            }}
          />
          <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-white shadow-inner">
            <p className="text-xs uppercase tracking-wide text-gray-500">{planName || "Plan"}</p>
            <p className="text-3xl font-semibold text-gray-900">
              {percentUsed !== null ? `${Math.round(percentUsed)}%` : "—"}
            </p>
            <p className="text-xs text-gray-500">of limit used</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
        {segments.map(({ label, value, helper }) => (
          <div key={label} className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase text-gray-500">{label}</p>
              {helper && <p className="text-xs text-gray-400">{helper}</p>}
            </div>
            <span className="text-base font-semibold text-gray-900">{renderValue(value)}</span>
          </div>
        ))}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase text-gray-500">Resets</p>
            <p className="text-xs text-gray-400">
              {stats.limit_reset ? stats.limit_reset.toUpperCase() : "—"}
            </p>
          </div>
          <span className="text-base font-semibold text-gray-900">
            {stats.limit_remaining !== undefined ? stats.limit_remaining : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

