"use client";

import { MdBugReport } from "react-icons/md";

export default function BugbotTab() {
  return (
    <div className="space-y-6">
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Bugbot</h2>
        <p className="text-sm text-gray-600 mb-6">
          AI-powered bug detection and automated issue tracking.
        </p>
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <MdBugReport className="text-4xl text-gray-600" />
          </div>
          <h3 className="text-gray-900 font-medium mb-2">Bugbot is Inactive</h3>
          <p className="text-gray-600 text-sm mb-4">Enable Bugbot to start monitoring your codebase for issues.</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
            Enable Bugbot
          </button>
        </div>
      </section>
    </div>
  );
}

