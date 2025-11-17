"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const providers = [
  { id: "google", label: "Continue with Google" },
  { id: "github", label: "Continue with GitHub" },
];

function SignInPageContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ideCallbackUrl, setIdeCallbackUrl] = useState(null);

  const errorMessage = useMemo(() => {
    if (!error) return null;
    switch (error) {
      case "AccountNotFound":
        return "We couldn't find an account for that email. Please create one first.";
      case "AuthServerError":
        return "We had trouble verifying your account. Please try again in a moment.";
      case "InvalidCredentials":
      case "CredentialsSignin":
        return "Invalid email or password. Please try again.";
      case "MissingCredentials":
        return "Enter both your email and password.";
      default:
        return "Unable to sign in. Please try again or contact support.";
    }
  }, [error]);

  useEffect(() => {
    // If user is already authenticated, prepare IDE callback URL
    if (status === "authenticated") {
      // Check if callbackUrl is an IDE callback
      const isIDECallback =
        callbackUrl.startsWith("ide://") ||
        callbackUrl.startsWith("assista://") ||
        callbackUrl.startsWith("cybrosys-assista://");
      
      if (isIDECallback) {
        // Prepare IDE callback URL with session tokens (but don't redirect yet)
        prepareIDECallback(callbackUrl);
      } else {
        // If not IDE callback, redirect to dashboard
        router.replace("/dashboard");
      }
    }
  }, [status, router, callbackUrl]);

  const prepareIDECallback = async (url) => {
    try {
      // Get session to extract JWT tokens and user details for IDE
      const sessionResponse = await fetch("/api/auth/session");
      if (sessionResponse.ok) {
        const session = await sessionResponse.json();
        const redirectUrl = new URL(url);
        
        // Add session tokens to callback URL
        if (session?.access_token) {
          redirectUrl.searchParams.set("access_token", session.access_token);
        }
        if (session?.refresh_token) {
          redirectUrl.searchParams.set("refresh_token", session.refresh_token);
        }
        if (session?.sessionId) {
          redirectUrl.searchParams.set("session_id", session.sessionId);
        }
        
        // Add user details to callback URL
        if (session?.user) {
          if (session.user.email) {
            redirectUrl.searchParams.set("email", session.user.email);
          }
          if (session.user.name) {
            redirectUrl.searchParams.set("name", encodeURIComponent(session.user.name));
          }
          if (session.user.image) {
            redirectUrl.searchParams.set("image", session.user.image);
          }
          if (session.user.provider) {
            redirectUrl.searchParams.set("provider", session.user.provider);
          }
          if (session.user.id) {
            redirectUrl.searchParams.set("user_id", session.user.id);
          }
        }
        
        // Store the callback URL - user will click button to trigger redirect
        setIdeCallbackUrl(redirectUrl.toString());
      }
    } catch (error) {
      console.error("Failed to prepare IDE callback", error);
      // On error, still set the original URL
      setIdeCallbackUrl(url);
    }
  };

  const handleIDECallback = async (url) => {
    // Check if this is an IDE callback URL
    if (
      url.startsWith("ide://") ||
      url.startsWith("assista://") ||
      url.startsWith("cybrosys-assista://")
    ) {
      try {
        // Get session to extract JWT tokens and user details for IDE
        const sessionResponse = await fetch("/api/auth/session");
        if (sessionResponse.ok) {
          const session = await sessionResponse.json();
          const redirectUrl = new URL(url);
          
          // Add session tokens to callback URL
          if (session?.access_token) {
            redirectUrl.searchParams.set("access_token", session.access_token);
          }
          if (session?.refresh_token) {
            redirectUrl.searchParams.set("refresh_token", session.refresh_token);
          }
          if (session?.sessionId) {
            redirectUrl.searchParams.set("session_id", session.sessionId);
          }
          
          // Add user details to callback URL
          if (session?.user) {
            if (session.user.email) {
              redirectUrl.searchParams.set("email", session.user.email);
            }
            if (session.user.name) {
              redirectUrl.searchParams.set("name", encodeURIComponent(session.user.name));
            }
            if (session.user.image) {
              redirectUrl.searchParams.set("image", session.user.image);
            }
            if (session.user.provider) {
              redirectUrl.searchParams.set("provider", session.user.provider);
            }
            // Include user ID if available
            if (session.user.id) {
              redirectUrl.searchParams.set("user_id", session.user.id);
            }
          }
          
          // Use window.location.href for custom URL schemes (router.replace doesn't work)
          window.location.href = redirectUrl.toString();
          return;
        } else {
          // If session fetch failed but we're authenticated, still try to redirect
          // The IDE can handle missing tokens and request re-authentication
          console.warn("Session fetch failed, redirecting without tokens");
          window.location.href = url;
          return;
        }
      } catch (error) {
        console.error("Failed to get session for IDE callback", error);
        // On error, still redirect to IDE callback (IDE can handle missing tokens)
        window.location.href = url;
        return;
      }
    }
    
    // Default redirect for non-IDE URLs - go to dashboard
    router.replace("/dashboard");
  };

  const handleOAuth = (providerId) => {
    signIn(providerId, { callbackUrl });
  };

  const handleCredentialsSignIn = async (event) => {
    event.preventDefault();
    setFormError(null);

    if (!email.trim() || !password.trim()) {
      setFormError("Enter both your email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
        callbackUrl,
      });

      if (result?.error) {
        let message = result.error;
        try {
          const parsed = JSON.parse(result.error);
          message = parsed?.detail || parsed?.message || message;
        } catch {
          // ignore JSON parse errors
        }

        if (message === "InvalidCredentials" || message === "CredentialsSignin") {
          message = "Invalid email or password. Please try again.";
        }

        setFormError(message || "Unable to sign in. Please try again.");
        return;
      }

      // Check if callbackUrl is an IDE callback
      const isIDECallback =
        (result?.url || callbackUrl).startsWith("ide://") ||
        (result?.url || callbackUrl).startsWith("assista://") ||
        (result?.url || callbackUrl).startsWith("cybrosys-assista://");
      
      if (isIDECallback) {
        // Prepare IDE callback URL - user will click button to trigger redirect
        await prepareIDECallback(result?.url || callbackUrl);
      } else {
        // Regular redirect for non-IDE URLs
        router.replace(result?.url || callbackUrl);
      }
    } catch (signInError) {
      console.error("Credential sign-in failed", signInError);
      setFormError("Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication status
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show IDE callback button if authenticated and callback URL is ready
  if (status === "authenticated" && ideCallbackUrl) {
    const handleOpenIDE = () => {
      // This must be triggered by user click to work with custom URL schemes
      window.location.href = ideCallbackUrl;
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Successfully signed in!</h1>
            <p className="text-sm text-gray-500">
              Click the button below to open Assista IDE with your account.
            </p>
            <button
              onClick={handleOpenIDE}
              className="w-full rounded-full bg-(--primary-color) px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Open Assista IDE
            </button>
            <p className="text-xs text-gray-400 mt-4">
              If the IDE doesn&apos;t open automatically, make sure it&apos;s installed and running.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading if authenticated but callback URL not ready yet
  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Preparing redirect...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500">
            Sign in to continue with your Assista account.
          </p>
        </div>

        {(errorMessage || formError) && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError || errorMessage}
          </div>
        )}

        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-xs font-semibold uppercase text-gray-500">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:border-(--primary-color) focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-xs font-semibold uppercase text-gray-500">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:border-(--primary-color) focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-(--primary-color) px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="space-y-3">
          {providers.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => handleOAuth(provider.id)}
              className="w-full rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:border-(--primary-color) hover:text-(--primary-color)"
            >
              {provider.label}
            </button>
          ))}
        </div>

        <div className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href={{ pathname: "/signup", query: { callbackUrl } }}
            className="font-medium text-(--primary-color) hover:underline"
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignInPageContent />
    </Suspense>
  );
}

