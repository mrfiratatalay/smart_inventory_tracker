"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import InventoryForm from "@/components/InventoryForm";
import InventoryList from "@/components/InventoryList";

export default function HomeClient() {
  const [activeTab, setActiveTab] = useState<"list" | "add" | "admin">("list");
  const [adminStats, setAdminStats] = useState<{
    totalUsers: number;
    totalItems: number;
    totalValue: number;
    systemHealth: string;
  } | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check if user is admin
  const isAdmin = session?.user?.role === "ADMIN";

  // Fetch admin statistics
  useEffect(() => {
    if (isAdmin && activeTab === "admin") {
      fetchAdminStats();
    }
  }, [isAdmin, activeTab]);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const stats = await response.json();
        setAdminStats(stats);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    }
  };

  // Handle redirect in useEffect to avoid setState during render
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading state while redirecting
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1"></div>

            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📦 Smart Inventory Tracker
              </h1>
              <p className="text-lg text-gray-600">
                Full-stack inventory management system
              </p>

              {/* Role-based Welcome Message */}
              {isAdmin && (
                <div className="mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    👑 Admin Dashboard
                  </span>
                </div>
              )}
            </div>

            {/* User Info & Sign Out */}
            <div className="flex-1 flex justify-end">
              <div className="bg-white rounded-lg shadow-sm border p-4 text-right">
                <div className="text-sm text-gray-600 mb-2">Welcome back!</div>
                <div className="font-medium text-gray-900 mb-1">
                  {session?.user?.name || session?.user?.email}
                </div>

                {/* Role Badge */}
                <div className="mb-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      isAdmin
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {isAdmin ? "👑 Admin" : "👤 User"}
                  </span>
                </div>

                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="w-3 h-3 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("list")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "list"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                📦 {isAdmin ? "All Inventories" : "My Inventory"}
              </button>
              <button
                onClick={() => setActiveTab("add")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "add"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                ➕ Add Item
              </button>

              {/* Admin-only tab */}
              {isAdmin && (
                <button
                  onClick={() => setActiveTab("admin")}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "admin"
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  👑 Admin Panel
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <main className="max-w-7xl mx-auto">
          {activeTab === "list" && <InventoryList />}
          {activeTab === "add" && (
            <div className="max-w-2xl mx-auto">
              <InventoryForm onCancel={() => setActiveTab("list")} />
            </div>
          )}
          {activeTab === "admin" && isAdmin && (
            <div className="space-y-6">
              {/* Admin Dashboard */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  👑 Admin Dashboard
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    System-wide management
                  </span>
                </h2>

                {/* Admin Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-blue-600 text-sm font-medium">
                      Total Users
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
                      {adminStats ? adminStats.totalUsers : "..."}
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-green-600 text-sm font-medium">
                      Total Items
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                      {adminStats ? adminStats.totalItems : "..."}
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-yellow-600 text-sm font-medium">
                      Total Value
                    </div>
                    <div className="text-2xl font-bold text-yellow-900">
                      {adminStats
                        ? `$${adminStats.totalValue.toFixed(2)}`
                        : "..."}
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="text-purple-600 text-sm font-medium">
                      System Health
                    </div>
                    <div className="text-2xl font-bold text-purple-900">
                      ✅ Healthy
                    </div>
                  </div>
                </div>

                {/* Admin Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Admin Features
                  </h3>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      🔧 System Management
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      As an admin, you have full access to manage all
                      users&apos; inventory items, view system statistics, and
                      perform administrative tasks.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-green-600">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        View and edit all users&apos; inventory items
                      </div>
                      <div className="flex items-center text-green-600">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Access system-wide analytics and reports
                      </div>
                      <div className="flex items-center text-green-600">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Manage user roles and permissions
                      </div>
                      <div className="flex items-center text-green-600">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Perform bulk operations on inventory data
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">
                      💡 Pro Tip
                    </h4>
                    <p className="text-sm text-blue-700">
                      Your admin role gives you enhanced capabilities. The
                      &quot;All Inventories&quot; tab shows items from all
                      users, while regular users only see their own items.
                    </p>
                  </div>

                  {/* Role-Based Access Control Info */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">
                      🔐 Role-Based Access Control (RBAC)
                    </h4>
                    <p className="text-sm text-green-700 mb-3">
                      This system implements proper authorization controls:
                    </p>
                    <div className="space-y-1 text-sm text-green-700">
                      <div>
                        • <strong>Admin users:</strong> Can view, edit, and
                        delete ALL inventory items
                      </div>
                      <div>
                        • <strong>Regular users:</strong> Can only manage their
                        OWN inventory items
                      </div>
                      <div>
                        • <strong>API protection:</strong> All endpoints
                        validate user permissions
                      </div>
                      <div>
                        • <strong>UI restrictions:</strong> Actions are hidden
                        based on user role
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>
            Built with Next.js 15, MongoDB, Prisma, NextAuth.js, and Tailwind
            CSS
          </p>
          {isAdmin && (
            <p className="mt-1 text-purple-600">
              👑 Admin Mode: Enhanced features enabled
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}
