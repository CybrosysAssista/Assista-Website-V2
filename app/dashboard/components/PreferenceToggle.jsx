"use client";

import { useState } from "react";

export default function PreferenceToggle({ title, description }) {
  const [enabled, setEnabled] = useState(true);

  return (
    <label className="flex justify-between items-start gap-6 border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition bg-gray-50 cursor-pointer">
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600 mt-1 max-w-xl">{description}</p>
      </div>
      <div className="relative">
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => setEnabled((prev) => !prev)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
      </div>
    </label>
  );
}

