"use client";

import { useEffect, useMemo, useState } from "react";
import UsageChart from "./UsageChart";
import { useApiKeys, useCreateApiKey, useDeleteApiKey } from "../../hooks/useApiKeys";
import { useKeyStats } from "../../hooks/useKeyUsage";

export default function OverviewTab({ user }) {
  const [timePeriod, setTimePeriod] = useState("30d");
  const [limitReset, setLimitReset] = useState("monthly");
  const [includeByok, setIncludeByok] = useState(true);
  const [expiresOn, setExpiresOn] = useState("");
  const [provisionError, setProvisionError] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [keysMessage, setKeysMessage] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState("pro");
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [modalPlan, setModalPlan] = useState(null);

  const userEmail = useMemo(() => user?.portal_email || user?.email || "", [user]);
  const userName = useMemo(() => user?.portal_name || user?.name || "", [user]);

  const getPlanIdFromLimit = (limit) => {
    if (!limit || Number.isNaN(Number(limit))) {
      return "pro";
    }
    const numericLimit = Number(limit);
    if (numericLimit === 60) return "proPlus";
    if (numericLimit === 200) return "ultra";
    if (numericLimit === 20) return "pro";
    return "custom";
  };

  // React Query hooks
  const { data: userKeys = [], isLoading: isLoadingKeys, error: keysError } = useApiKeys(userEmail);
  
  const activeSubscription = useMemo(() => userKeys[0] || null, [userKeys]);
  const hasActiveSubscription = Boolean(activeSubscription);
  const activePlanId = hasActiveSubscription ? getPlanIdFromLimit(activeSubscription?.limit) : null;
  const activeSubscriptionId = activeSubscription?.id ?? null;

  const { data: keyStats, isLoading: isLoadingStats, error: statsError } = useKeyStats(
    activeSubscriptionId
  );
  const createApiKeyMutation = useCreateApiKey();
  const deleteApiKeyMutation = useDeleteApiKey();

  useEffect(() => {
    if (!hasActiveSubscription) {
      return;
    }

    const derived = getPlanIdFromLimit(activeSubscription?.limit);
    setSelectedPlanId(derived);
    if (derived === "custom" && activeSubscription?.limit) {
      setSelectedAmount(activeSubscription.limit);
    }
  }, [hasActiveSubscription, activeSubscription?.limit]);

  // Handle errors from React Query
  useEffect(() => {
    if (keysError) {
      setKeysMessage({ type: "error", text: "Couldn't load your API keys. Try again." });
    }
  }, [keysError]);

  const handleGenerateApiKey = async (overrideAmount) => {
    if (createApiKeyMutation.isPending || hasActiveSubscription) {
      setKeysMessage({
        type: "error",
        text: "You already have an active subscription. Manage it instead of provisioning a new one.",
      });
      return;
    }
    await createSubscription(typeof overrideAmount === "number" ? overrideAmount : selectedAmount, "Managed");
  };

  const handleDeleteKey = async (recordId) => {
    if (deleteApiKeyMutation.isPending) return;

    setKeysMessage(null);
    try {
      await deleteApiKeyMutation.mutateAsync({
        recordId,
        userEmail,
      });
      setKeysMessage({ type: "success", text: "Subscription cancelled." });
    } catch (error) {
      console.error("Failed to delete key", error);
      setKeysMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to delete key.",
      });
    }
  };

  const cancelSubscription = async ({ silent = false } = {}) => {
    if (!activeSubscription) return true;
    try {
      await deleteApiKeyMutation.mutateAsync({
        recordId: activeSubscription.id,
        userEmail,
      });
      setSelectedPlanId("pro");
      setSelectedAmount(20);
      if (!silent) {
        setKeysMessage({ type: "success", text: "Subscription cancelled." });
      }
      return true;
    } catch (error) {
      console.error("Failed to cancel subscription", error);
      setKeysMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to cancel subscription.",
      });
      return false;
    }
  };

  const createSubscription = async (amount, planLabel = "Subscription") => {
    if (!userEmail) {
      setProvisionError("We need a verified email address to issue a key. Please update your profile.");
      return false;
    }
    if (!amount || Number.isNaN(amount) || amount < 5) {
      setProvisionError("Enter a valid amount before upgrading.");
      return false;
    }

    setProvisionError(null);

    try {
      const ownerLabel = userName || userEmail || "Customer";
      const payload = {
        name: `${ownerLabel} Key ${new Date().toISOString()}`,
        limit: amount,
        limit_reset: limitReset,
        include_byok_in_limit: includeByok,
        user_email: userEmail,
        user_name: userName,
      };

      if (expiresOn) {
        const parsed = new Date(`${expiresOn}T23:59:59Z`);
        if (!Number.isNaN(parsed.getTime())) {
          const utc = new Date(parsed.getTime() + parsed.getTimezoneOffset() * 60000);
          payload.expires_at = utc.toISOString();
        }
      }

      await createApiKeyMutation.mutateAsync({
        payload,
        userEmail,
      });
      setSelectedAmount(amount);
      setKeysMessage({ type: "success", text: `${planLabel} plan activated.` });
      return true;
    } catch (error) {
      console.error("Failed to provision key:", error);
      const message =
        error instanceof Error
          ? error.message.includes("409") || error.message.includes("already")
            ? "You already have an active subscription. Cancel it before creating a new one."
            : error.message
          : "Unable to provision key. Please try again.";
      setProvisionError(message);
      setKeysMessage({ type: "error", text: message });
      return false;
    }
  };

  const handlePlanUpgrade = async (plan) => {
    const amount = plan.id === "custom" ? selectedAmount : plan.price;
    if (!amount || Number.isNaN(amount) || amount < 5) {
      setKeysMessage({ type: "error", text: "Enter a valid amount before upgrading." });
      return;
    }

    if (hasActiveSubscription) {
      if (activePlanId === plan.id) {
        setKeysMessage({ type: "success", text: `You are already on the ${plan.name} plan.` });
        setIsManageModalOpen(false);
        return;
      }

      const cancelled = await cancelSubscription({ silent: true });
      if (!cancelled) {
        return;
      }
    }

    const success = await createSubscription(amount, plan.name);
    if (success) {
      setSelectedPlanId(plan.id);
      if (plan.id !== "custom") {
        setSelectedAmount(plan.price);
      }
      setIsManageModalOpen(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!activeSubscription) {
      setKeysMessage({ type: "error", text: "No active subscription to manage." });
      return;
    }
    await cancelSubscription();
    setIsManageModalOpen(false);
  };

  const formatCurrency = (value) => `$${value}`;
  
  const planOptions = [
    {
      id: "pro",
      name: "Pro",
      price: 20,
      description: "Entry-level plan with access to premium models, unlimited Tab completions, and more.",
      accent: "light",
    },
    {
      id: "proPlus",
      name: "Pro+",
      price: 60,
      description: "Get 3x more usage than Pro, unlock higher limits on Agent, and more.",
      accent: "light",
    },
    {
      id: "ultra",
      name: "Ultra",
      price: 200,
      description: "Run parallel agents, get maximum value with 20x usage limits, and early access to advanced features.",
      accent: "light",
    },
    {
      id: "custom",
      name: "Custom",
      price: selectedAmount,
      description: "Need a bespoke limit? Set a custom amount for your workspace.",
      accent: "light",
      custom: true,
    },
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlanId(plan.id);
    if (plan.id !== "custom" && plan.price) {
      setSelectedAmount(plan.price);
    }
  };

  const openManageModal = (plan) => {
    const effectivePrice = plan.id === "custom" ? selectedAmount : plan.price;
    setModalPlan({ ...plan, price: effectivePrice });
    setIsManageModalOpen(true);
  };

  const closeManageModal = () => {
    setIsManageModalOpen(false);
    setModalPlan(null);
  };

  const selectedPlan = planOptions.find((plan) => plan.id === selectedPlanId);
  const activePlan = planOptions.find((plan) => plan.id === activePlanId);

  // Calculate date range based on selected period
  const getDateRange = (period) => {
    const now = new Date();
    const formatDate = (date) => {
      const month = date.toLocaleString("default", { month: "short" });
      const day = date.getDate();
      return `${month} ${day}`;
    };

    let startDate;
    switch (period) {
      case "1d":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 1);
        return `${formatDate(startDate)} - ${formatDate(now)}`;
      case "7d":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        return `${formatDate(startDate)} - ${formatDate(now)}`;
      case "30d":
      default:
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
        return `${formatDate(startDate)} - ${formatDate(now)}`;
    }
  };

  const dateRange = useMemo(() => getDateRange(timePeriod), [timePeriod]);

  // Get usage data based on selected period
  const getUsageForPeriod = (stats, period) => {
    if (!stats) return null;
    
    switch (period) {
      case "1d":
        return {
          ...stats,
          usage: stats.usage_daily ?? stats.usage,
          byok_usage: stats.byok_usage_daily ?? stats.byok_usage,
        };
      case "7d":
        return {
          ...stats,
          usage: stats.usage_weekly ?? stats.usage,
          byok_usage: stats.byok_usage_weekly ?? stats.byok_usage,
        };
      case "30d":
      default:
        return {
          ...stats,
          usage: stats.usage_monthly ?? stats.usage,
          byok_usage: stats.byok_usage_monthly ?? stats.byok_usage,
        };
    }
  };

  // Only show stats for the active plan, not for selected plans
  const filteredStats = useMemo(() => {
    // Only show data if there's an active subscription
    if (!hasActiveSubscription || !keyStats || !activePlanId) return null;
    // Always show data for the active plan, regardless of selectedPlanId
    return getUsageForPeriod(keyStats, timePeriod);
  }, [keyStats, timePeriod, hasActiveSubscription, activePlanId]);

  return (
    <div className="space-y-8">
      {/* Model API Integration */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Your Plan</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {planOptions.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const isCurrentPlan = activePlanId === plan.id;

            return (
              <div
                key={plan.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectPlan(plan)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleSelectPlan(plan);
                  }
                }}
                className={`relative rounded-lg border bg-white p-5 transition-all cursor-pointer ${
                  isSelected
                    ? " "
                    : isCurrentPlan
                    ? "border-fuchsia-200 bg-fuchsia-50/30"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-medium text-white">
                      Active
                    </span>
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(plan.id === "custom" ? selectedAmount : plan.price)}
                    </span>
                    <span className="ml-1 text-sm text-gray-500">/mo</span>
                  </div>
                </div>

                {plan.id === "custom" ? (
                  <div className="mt-4">
                    <input
                      type="number"
                      min={5}
                      max={1000}
                      step={5}
                      value={selectedAmount}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(event) => {
                        const nextValue = Number(event.target.value);
                        setSelectedAmount(nextValue);
                        setSelectedPlanId("custom");
                      }}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter amount"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 line-clamp-2 mt-3">{plan.description}</p>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openManageModal(plan);
                  }}
                  disabled={createApiKeyMutation.isPending}
                  className={`mt-5 w-full rounded-md px-4 py-2 text-sm font-medium transition ${
                    isCurrentPlan
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : isSelected
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {isCurrentPlan ? "Manage" : "Select"}
                </button>
              </div>
            );
          })}
        </div>

        {keysMessage && (
          <div
            className={`mt-4 rounded-lg p-4 text-sm ${
              keysMessage.type === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            {keysMessage.text}
          </div>
        )}
      </section>

      {isManageModalOpen && modalPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeManageModal} aria-hidden="true" />
          <div className="relative w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Manage {modalPlan.name}</h3>
            <p className="text-sm text-gray-600 mb-6">
              {formatCurrency(modalPlan.price)} per month
            </p>

            <div className="space-y-3">
              <button
                type="button"
                disabled={createApiKeyMutation.isPending || deleteApiKeyMutation.isPending}
                onClick={async () => {
                  await handlePlanUpgrade(modalPlan);
                }}
                className="w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createApiKeyMutation.isPending
                  ? "Processing..."
                  : activePlanId === modalPlan.id
                    ? "Current Plan"
                    : `Upgrade to ${modalPlan.name}`}
              </button>

              {hasActiveSubscription && (
                <button
                  type="button"
                  disabled={deleteApiKeyMutation.isPending}
                  onClick={async () => {
                    await handleManageSubscription();
                  }}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleteApiKeyMutation.isPending ? "Cancelling..." : "Cancel Subscription"}
                </button>
              )}

              <button
                type="button"
                onClick={closeManageModal}
                className="w-full rounded-md px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:text-gray-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Usage Analytics</h2>
            <p className="text-sm text-gray-500 mt-1">{dateRange}</p>
          </div>
          <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
            {["1d", "7d", "30d"].map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  timePeriod === period
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <UsageChart
            stats={filteredStats}
            isLoading={isLoadingStats}
            planName={activePlan?.name || (hasActiveSubscription ? "Active Plan" : null)}
            error={statsError}
          />
        </div>
      </section>
    </div>
  );
}

