"use client";

export default function IntegrationsTab() {
  return (
    <div className="space-y-6">
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Integrations</h2>
        <p className="text-sm text-gray-600 mb-6">
          Connect your favorite tools and services with Assista Wiki.
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                G
              </div>
              <div>
                <h3 className="text-gray-900 font-medium">GitHub</h3>
                <p className="text-xs text-gray-600">Connect your GitHub repositories</p>
              </div>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
              Connect
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                GL
              </div>
              <div>
                <h3 className="text-gray-900 font-medium">GitLab</h3>
                <p className="text-xs text-gray-600">Connect your GitLab projects</p>
              </div>
            </div>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-all">
              Connect
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

