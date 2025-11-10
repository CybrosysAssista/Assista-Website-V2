"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const providers = [
  { id: "google", label: "Sign up with Google" },
  { id: "github", label: "Sign up with GitHub" },
];

function SignUpPageContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleOAuth = (providerId) => {
    signIn(providerId, { callbackUrl });
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

