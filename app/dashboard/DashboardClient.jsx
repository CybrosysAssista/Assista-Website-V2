"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  MdAccessTime, 
  MdSettings, 
  MdIntegrationInstructions, 
  MdCloud, 
  MdBugReport, 
  MdBarChart, 
  MdPayment,
  MdDescription,
  MdMail,
  MdLogout,
  MdKeyboardArrowDown,
  MdAdminPanelSettings,
  MdShowChart
} from "react-icons/md";

import OverviewTab from "./components/OverviewTab";
import SettingsTab from "./components/SettingsTab";
import IntegrationsTab from "./components/IntegrationsTab";
import CloudAgentsTab from "./components/CloudAgentsTab";
import BugbotTab from "./components/BugbotTab";
import UsageTab from "./components/UsageTab";
import BillingTab from "./components/BillingTab";
import DashboardHeader from "./components/DashboardHeader";
import AdminTab from "./components/AdminTab";
import ActivityTab from "./components/ActivityTab";

const baseNavigationItems = [
  { id: "overview", label: "Overview", icon: MdAccessTime },
  { id: "activity", label: "Activity", icon: MdShowChart },
  { id: "settings", label: "Settings", icon: MdSettings },
  { id: "integrations", label: "Integrations", icon: MdIntegrationInstructions },
  { id: "cloudagents", label: "Cloud Agents", icon: MdCloud },
  { id: "bugbot", label: "Bugbot", icon: MdBugReport },
  { id: "usage", label: "Usage", icon: MdBarChart },
  { id: "billing", label: "Billing & Invoices", icon: MdPayment },
];

export default function DashboardClient({ user }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitializedRef = useRef(false);

  const userRole = (user?.portal_role || user?.role || "").toLowerCase();
  const isAdmin = userRole === "admin";
  useEffect(() => {
    // Ensure admin detection also considers the role field
    console.info("Dashboard role detection", { userRole, isAdmin });
  }, [userRole, isAdmin]);

  const navigationItems = useMemo(() => {
    const items = [...baseNavigationItems];
    if (isAdmin) {
      items.push({ id: "admin", label: "Admin", icon: MdAdminPanelSettings });
    }
    return items;
  }, [isAdmin]);

  // Get initial tab from URL or default
  const getInitialTab = () => {
    const tabFromUrl = searchParams.get("tab");
    const isValidTab = tabFromUrl && navigationItems.some((item) => item.id === tabFromUrl);
    return isValidTab ? tabFromUrl : navigationItems[0]?.id || "overview";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  // Sync URL to state (only when URL changes, not when state changes)
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    const isValidTab = tabFromUrl && navigationItems.some((item) => item.id === tabFromUrl);
    
    if (isValidTab) {
      setActiveTab((currentTab) => {
        // Only update if different to prevent unnecessary re-renders
        return tabFromUrl !== currentTab ? tabFromUrl : currentTab;
      });
    } else if (!tabFromUrl || !isValidTab) {
      const defaultTab = navigationItems[0]?.id || "overview";
      setActiveTab((currentTab) => {
        if (defaultTab !== currentTab && !isInitializedRef.current) {
          isInitializedRef.current = true;
          router.replace(`/dashboard?tab=${defaultTab}`, { scroll: false });
        }
        return currentTab;
      });
    }
  }, [searchParams, navigationItems, router]);

  // Update URL when tab changes
  const handleTabChange = (tabId) => {
    if (!navigationItems.some((item) => item.id === tabId) || tabId === activeTab) {
      return;
    }
    setActiveTab(tabId);
    router.replace(`/dashboard?tab=${tabId}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <DashboardHeader />
      <div className="flex container max-w-6xl mx-auto mt-10">
        {/* Left Sidebar */}
        <aside className="w-64 max-w-64 flex flex-col sticky top-0">
          {/* User Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "Profile"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {(user?.name || user?.email || "?").slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-gray-900 text-sm font-medium truncate">
                    {user?.name || user?.email?.split("@")[0] || "User"}
                  </p>
                  <MdKeyboardArrowDown className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Pro Plan • {user?.email?.split("@")[0] || "user"}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all mb-1 ${
                    activeTab === item.id
                      ? "bg-gray-200 text-gray-900 font-medium"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <IconComponent className="text-lg" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer Links */}
          <div className="p-4 border-t border-gray-200">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all mb-1">
              <MdDescription className="text-lg" />
              <span>Docs</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all mb-1">
              <MdMail className="text-lg" />
              <span>Contact Us</span>
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-red-600 hover:bg-gray-100 transition-all"
            >
              <MdLogout className="text-lg" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-6xl mx-auto p-8">
            {activeTab === "overview" && <OverviewTab user={user} />}
            {activeTab === "activity" && <ActivityTab user={user} />}
            {activeTab === "settings" && <SettingsTab user={user} />}
            {activeTab === "integrations" && <IntegrationsTab />}
            {activeTab === "cloudagents" && <CloudAgentsTab />}
            {activeTab === "bugbot" && <BugbotTab />}
            {activeTab === "usage" && <UsageTab />}
            {activeTab === "billing" && <BillingTab />}
            {isAdmin && activeTab === "admin" && <AdminTab user={user} />}
          </div>
        </main>
      </div>
    </div>
  );
}
