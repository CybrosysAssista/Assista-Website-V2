"use client";

export default function UsageTab() {
  return (
    <div className="space-y-6">
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Usage Statistics</h2>
        <p className="text-sm text-gray-600 mb-6">
          Track your Assista Wiki usage across all features.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Documentation Requests</p>
            <p className="text-gray-900 text-2xl font-semibold">24</p>
            <p className="text-gray-400 text-xs mt-1">of 50 this month</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">AI Questions</p>
            <p className="text-gray-900 text-2xl font-semibold">156</p>
            <p className="text-gray-400 text-xs mt-1">unlimited</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Storage Used</p>
            <p className="text-gray-900 text-2xl font-semibold">2.4GB</p>
            <p className="text-gray-400 text-xs mt-1">of 10GB</p>
          </div>
        </div>
      </section>
    </div>
  );
}

