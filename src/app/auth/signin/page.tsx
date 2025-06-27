"use client";

import dynamic from "next/dynamic";

// Dynamic import with no SSR to prevent hydration mismatches
const SignInComponent = dynamic(() => import("./signin-client"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📦 Smart Inventory
          </h1>
          <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
        </div>
      </div>
    </div>
  ),
});

export default function SignIn() {
  return <SignInComponent />;
}
