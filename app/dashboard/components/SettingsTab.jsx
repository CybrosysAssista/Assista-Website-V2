"use client";

import { useEffect, useMemo, useState } from "react";
import { MdVerifiedUser, MdAdminPanelSettings } from "react-icons/md";
import { MdDevices, MdAccessTime, MdLogout } from "react-icons/md";
import PreferenceToggle from "./PreferenceToggle";
import { useSessions, useRevokeSession } from "../../hooks/useSessions";

export default function SettingsTab({ user, isLoadingProfile = false, profileError = null }) {
  const roleValue = useMemo(() => (user?.role || user?.portal_role || "").toLowerCase(), [user?.role, user?.portal_role]);
  const isAdmin = roleValue === "admin";

  const emailAddress = useMemo(() => user?.email || user?.portal_email || "", [user?.email, user?.portal_email]);
  const [sessionMessage, setSessionMessage] = useState(null);

  // React Query hooks
  const { data: sessions = [], isLoading: isLoadingSessions, error: sessionsError } = useSessions(emailAddress);
  const revokeSessionMutation = useRevokeSession();

  // Handle errors from React Query
  useEffect(() => {
    if (sessionsError) {
      setSessionMessage({ type: "error", text: "Unable to load active sessions." });
    }
  }, [sessionsError]);

  const handleRevoke = async (sessionId) => {
    if (!sessionId || revokeSessionMutation.isPending) {
      return;
    }

    setSessionMessage(null);
    try {
      await revokeSessionMutation.mutateAsync({
        sessionId,
        userEmail: emailAddress,
      });
      setSessionMessage({
        type: "success",
        text: "Session revoked. It may take a moment to sign out on that device.",
      });
    } catch (error) {
      console.error("Failed to revoke session", error);
      setSessionMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to revoke session.",
      });
    }
  };

  const activeSessions = useMemo(
    () => sessions.filter((session) => !session.revoked_at),
    [sessions]
  );

  const endedSessions = useMemo(
    () => sessions.filter((session) => session.revoked_at),
    [sessions]
  );

  const parseUtcDate = (value) => {
    if (!value) return null;
    const normalized = value.endsWith("Z") ? value : `${value}Z`;
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  return (
    <div className="space-y-6">
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Profile</h2>
        <p className="text-sm text-gray-600 mb-6">
          Your profile information and account details.
        </p>
        {profileError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {profileError}
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={user?.name || user?.portal_name || ""}
              readOnly
              className="w-full rounded-lg border border-gray-200 bg-gray-50 text-gray-500 px-4 py-3 text-sm focus:outline-none cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={user?.email || user?.portal_email || ""}
              readOnly
              className="w-full rounded-lg border border-gray-200 bg-gray-50 text-gray-500 px-4 py-3 text-sm focus:outline-none cursor-not-allowed"
            />
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Connected Provider</label>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium">
              <MdVerifiedUser className="text-lg" />
              {(user?.provider || user?.auth_provider || "credentials").toUpperCase()}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium ${
              isAdmin ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-600"
            }`}>
              <MdAdminPanelSettings className="text-lg" />
              {isAdmin ? "Admin" : roleValue ? roleValue.charAt(0).toUpperCase() + roleValue.slice(1) : "Standard"}
            </div>
          </div>
        </div>
        {isLoadingProfile && (
          <p className="mt-4 text-xs text-gray-400">Refreshing profile details…</p>
        )}
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Workspace Preferences</h2>
        <p className="text-sm text-gray-600 mb-6">
          Configure how Assista Wiki responds to your repository documentation requests.
        </p>
        <div className="space-y-4">
          <PreferenceToggle
            title="Email Notifications"
            description="Get notified when documentation generation completes or new insights are available."
          />
          <PreferenceToggle
            title="Team Access"
            description="Allow teammates with the same email domain to view your generated documentation."
          />
          <PreferenceToggle
            title="AI Enhancements"
            description="Enable premium AI providers by default when generating project documentation."
          />
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Login & Sessions</h2>
          <p className="text-sm text-gray-600">
            Manage devices and browsers that currently have access to your Assista account.
          </p>
        </div>

        {sessionMessage && (
          <div
            className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
              sessionMessage.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {sessionMessage.text}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Active sessions</h3>
            <div className="mt-3 space-y-3">
              {isLoadingSessions && <p className="text-sm text-gray-500">Loading active sessions…</p>}
              {!isLoadingSessions && activeSessions.length === 0 && (
                <p className="text-sm text-gray-500">No active sessions right now.</p>
              )}
              {activeSessions.map((session) => (
                <div
                  key={session.session_id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <MdDevices className="text-xl" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {session.device || session.provider || "Web"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.user_agent || "Unknown agent"}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <MdAccessTime className="text-sm" />
                          {(() => {
                            const timestamp = parseUtcDate(session.last_activity || session.last_active_at || session.created_at);
                            return timestamp
                              ? `Last active ${timestamp.toLocaleString()}`
                              : "Last active —";
                          })()}
                        </span>
                        {session.ip_address && <span>IP {session.ip_address}</span>}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRevoke(session.session_id)}
                    disabled={
                      revokeSessionMutation.isPending &&
                      revokeSessionMutation.variables?.sessionId === session.session_id
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-red-300 px-4 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    <MdLogout className="text-sm" />
                    {revokeSessionMutation.isPending &&
                    revokeSessionMutation.variables?.sessionId === session.session_id
                      ? "Revoking…"
                      : "Revoke"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {endedSessions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Recently revoked</h3>
              <div className="mt-3 space-y-3">
                {endedSessions.slice(0, 5).map((session) => (
                  <div
                    key={`${session.session_id}-revoked`}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                        <MdDevices className="text-xl" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {session.device || session.provider || "Web"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(() => {
                            const timestamp = parseUtcDate(session.revoked_at || session.last_activity || session.last_active_at);
                            return timestamp ? `Revoked ${timestamp.toLocaleString()}` : "Revoked";
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {endedSessions.length > 5 && (
                  <p className="text-xs text-gray-400">Showing last 5 revoked sessions.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

