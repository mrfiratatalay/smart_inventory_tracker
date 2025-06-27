"use client";

import dynamic from "next/dynamic";

// Dynamic import with no SSR to prevent hydration mismatches
const HomeComponent = dynamic(() => import("./home-client"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          📦 Smart Inventory Tracker
        </h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <HomeComponent />;
}
