"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    name: "",
    role: "USER" as "USER" | "ADMIN",
  });
  const router = useRouter();

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      console.log("Current session:", session);
      if (session) {
        console.log("User already signed in, redirecting to home");
        router.push("/");
      }
    });
  }, [router]);

  // Demo account quick fill
  const fillDemoAccount = () => {
    setCredentials({
      email: "demo@example.com",
      password: "demo123",
      name: "Demo User",
      role: "USER",
    });
    setIsSignUp(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log("Starting authentication process...", {
      isSignUp,
      credentials,
    });

    try {
      if (isSignUp) {
        // Sign up flow - create account with role
        const result = await signIn("credentials", {
          email: credentials.email,
          password: credentials.password,
          name: credentials.name,
          role: credentials.role,
          isSignUp: "true",
          redirect: false,
        });

        console.log("Sign-up result:", result);

        if (result?.ok) {
          console.log("Sign-up successful, checking session...");
          setTimeout(async () => {
            const session = await getSession();
            console.log("Session after sign-up:", session);

            if (session) {
              console.log("Session confirmed, redirecting to home");
              router.push("/");
            } else {
              setError(
                "Account created but session not established. Please try signing in."
              );
            }
          }, 1000);
        } else {
          console.error("Sign-up failed:", result?.error);
          setError(result?.error || "Sign-up failed. Please try again.");
        }
      } else {
        // Sign in flow
        const result = await signIn("credentials", {
          email: credentials.email,
          password: credentials.password,
          redirect: false,
        });

        console.log("Sign-in result:", result);

        if (result?.ok) {
          console.log("Sign-in successful, checking session...");
          setTimeout(async () => {
            const session = await getSession();
            console.log("Session after sign-in:", session);

            if (session) {
              console.log("Session confirmed, redirecting to home");
              router.push("/");
            } else {
              setError(
                "Authentication succeeded but session not created. Please try again."
              );
            }
          }, 1000);
        } else {
          console.error("Sign-in failed:", result?.error);
          setError(result?.error || "Sign-in failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Starting ${provider} OAuth sign-in...`);
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      console.error("OAuth sign-in error:", error);
      setError(`${provider} sign-in failed. Please try again.`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📦 Smart Inventory
          </h1>
          <h2 className="text-2xl font-bold text-gray-900">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp
              ? "Join our inventory management system"
              : "Welcome back! Choose your preferred sign-in method."}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Authentication Error
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Demo Account Quick Access */}
          {!isSignUp && (
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  🚀 Quick Demo Access
                </h3>
                <p className="text-xs text-blue-700 mb-3">
                  Try the app instantly with our demo account. Perfect for
                  testing!
                </p>
                <div className="text-xs text-blue-600 space-y-1 mb-3">
                  <p>
                    <strong>Email:</strong> demo@example.com
                  </p>
                  <p>
                    <strong>Password:</strong> demo123
                  </p>
                  <p>
                    <strong>Role:</strong> User
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fillDemoAccount}
                  className="w-full text-xs px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Fill Demo Credentials
                </button>
              </div>
            </div>
          )}

          {/* Sign In / Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={credentials.name}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required={isSignUp}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>

            {/* Role Selection (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Choose Your Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setCredentials((prev) => ({ ...prev, role: "USER" }))
                    }
                    className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                      credentials.role === "USER"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">👤</div>
                      <div className="font-semibold">User</div>
                      <div className="text-xs text-gray-500">
                        Manage your own inventory
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCredentials((prev) => ({ ...prev, role: "ADMIN" }))
                    }
                    className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                      credentials.role === "ADMIN"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">👑</div>
                      <div className="font-semibold">Admin</div>
                      <div className="text-xs text-gray-500">
                        Manage all inventories
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {loading
                ? isSignUp
                  ? "Creating Account..."
                  : "Signing in..."
                : isSignUp
                ? "Create Account"
                : "Sign In"}
            </button>

            {/* Toggle Sign In / Sign Up */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setCredentials({
                    email: "",
                    password: "",
                    name: "",
                    role: "USER",
                  });
                }}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>

          {/* Debug Info */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-800 mb-2">
              🔧 Debug Info
            </h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                <strong>Mode:</strong> {isSignUp ? "Sign Up" : "Sign In"}
              </p>
              <p>
                <strong>Selected Role:</strong> {credentials.role}
              </p>
              <p>
                <strong>Environment:</strong> {process.env.NODE_ENV}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* OAuth Providers */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => handleOAuthSignIn("google")}
              disabled={loading}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => handleOAuthSignIn("github")}
              disabled={loading}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Info Section */}
          <div className="mt-8 text-center">
            <div className="text-xs text-gray-500 space-y-2">
              <p>
                <strong>Note:</strong> OAuth providers require additional setup.
              </p>
              <p>
                For demonstration purposes, use the demo account or create a new
                account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
