"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRegister } from "../hooks/useAuth";

const providers = [
  { id: "google", label: "Sign up with Google" },
  { id: "github", label: "Sign up with GitHub" },
];

function SignUpPageContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState(null);

  // React Query hook
  const registerMutation = useRegister();

  const registrationError = useMemo(() => {
    if (!error) return null;
    switch (error) {
      case "RegistrationFailed":
        return "We couldn't finish setting up your account. Please try again or contact support.";
      default:
        return "Something went wrong while creating your account. Please try again.";
    }
  }, [error]);

  useEffect(() => {
    if (status === "authenticated") {
      // Handle IDE callback URLs with session tokens
      handleIDECallback(callbackUrl);
    }
  }, [status, router, callbackUrl]);

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

  const handleCredentialsSignup = async (event) => {
    event.preventDefault();
    setFormError(null);

    if (!email.trim() || !password.trim()) {
      setFormError("Enter your email address and a password to continue.");
      return;
    }

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      // Register user using React Query
      await registerMutation.mutateAsync({
        email: email.trim(),
        password,
        name: name.trim() || undefined,
      });

      // Auto sign in after registration
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
          // ignore parse errors
        }

        if (message === "InvalidCredentials" || message === "CredentialsSignin") {
          message = "We couldn't sign you in automatically. Please try signing in manually.";
        }
        setFormError(message || "Unable to sign in after registration.");
        return;
      }

      // Handle IDE callback URLs with session tokens
      await handleIDECallback(result?.url || callbackUrl);
    } catch (signupError) {
      console.error("Credential registration failed", signupError);
      setFormError(
        signupError instanceof Error
          ? signupError.message
          : "Unable to create your account. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500">
            Use your Google or GitHub account to get started with Assista.
          </p>
        </div>

        {(registrationError || formError) && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError || registrationError}
          </div>
        )}

        <form onSubmit={handleCredentialsSignup} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="signup-name" className="block text-xs font-semibold uppercase text-gray-500">
              Full Name
            </label>
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:border-(--primary-color) focus:outline-none"
              placeholder="Your name"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-email" className="block text-xs font-semibold uppercase text-gray-500">
              Email Address
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:border-(--primary-color) focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-password" className="block text-xs font-semibold uppercase text-gray-500">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:border-(--primary-color) focus:outline-none"
              placeholder="Create a password"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-password-confirm" className="block text-xs font-semibold uppercase text-gray-500">
              Confirm Password
            </label>
            <input
              id="signup-password-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:border-(--primary-color) focus:outline-none"
              placeholder="Re-enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full rounded-full bg-(--primary-color) px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {registerMutation.isPending ? "Creating account…" : "Create account"}
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
          Already have an account?{" "}
          <Link
            href={{ pathname: "/signin", query: { callbackUrl } }}
            className="font-medium text-(--primary-color) hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignUpPageContent />
    </Suspense>
  );
}

