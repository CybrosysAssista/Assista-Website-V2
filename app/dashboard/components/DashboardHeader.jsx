"use client";

import Link from "next/link";

export default function DashboardHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between mx-auto max-w-6xl px-8 py-5">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
        >
          <span>←</span>
          <span>Go to Home</span>
        </Link>
      </div>
    </header>
  );
}
