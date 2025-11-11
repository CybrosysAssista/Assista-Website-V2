"use client";
import React, { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Image from "next/image";

// API base URL - adjust this to match your server configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://assistawebsitebackend.easyinstance.com";

function Page() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(null); // Track which repo is being generated
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeoutRef = useRef(null);
  const lastTriggeredRef = useRef(0);

  // Popular/suggested repositories (fallback if no API endpoint exists)
  const suggestedRepos = [
    { repo: "microsoft/vscode", description: "Visual Studio Code" },
    {
      repo: "langchain-ai/langchain",
      description: "Build context-aware reasoning applications",
    },
    {
      repo: "huggingface/transformers",
      description:
        "State-of-the-art Machine Learning for PyTorch, TensorFlow, and JAX",
    },
    {
      repo: "openai/whisper",
      description: "Robust Speech Recognition via Large-Scale Weak Supervision",
    },
    {
      repo: "facebook/react",
      description: "A declarative, efficient, and flexible JavaScript library",
    },
    {
      repo: "vercel/next.js",
      description: "The React Framework for Production",
    },
  ];

  // Initialize with suggested repos
  useEffect(() => {
    setRepos(suggestedRepos);
  }, []);

  // Debounced search (shows suggested or typed repo)
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!value.trim()) {
      setRepos(suggestedRepos);
      return;
    }
    searchTimeoutRef.current = setTimeout(() => {
      searchRepositories(value);
    }, 400);
  };

  const isValidRepo = (value) => {
    const trimmed = value.trim();
    if (!trimmed.includes("/")) return false;
    const parts = trimmed.split("/");
    if (parts.length !== 2) return false;
    const [owner, repo] = parts;
    return owner && repo && !owner.includes(" ") && !repo.includes(" ");
  };

  const handleSearchKeyDown = async (e) => {
    if (e.key !== "Enter") return;
    const value = e.currentTarget.value;
    if (!isValidRepo(value)) return;
    const now = Date.now();
    if (now - lastTriggeredRef.current < 1000) return;
    lastTriggeredRef.current = now;
    if (generating) return;
    await handleGenerateDocs(value.trim());
  };

  const searchRepositories = (query) => {
    const q = query.trim();
    if (!q) {
      setRepos(suggestedRepos);
      return;
    }
    if (isValidRepo(q)) {
      const [owner, repoName] = q.split("/");
      const item = { repo: q, description: `Repository: ${owner}/${repoName}` };
      setRepos([item, ...suggestedRepos.filter((r) => r.repo !== q)]);
      return;
    }
    const filtered = suggestedRepos.filter(
      (r) =>
        r.repo.toLowerCase().includes(q.toLowerCase()) ||
        r.description.toLowerCase().includes(q.toLowerCase())
    );
    setRepos(filtered.length ? filtered : suggestedRepos);
  };

  // Generate documentation for a repository
  const handleGenerateDocs = async (repo) => {
    try {
      setGenerating(repo);
      setError(null);
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repo }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: response.statusText }));
        throw new Error(
          errorData.error ||
            `Failed to generate documentation: ${response.statusText}`
        );
      }

      const data = await response.json();

      // Store the generated documentation in sessionStorage to pass to details page
      if (data.markdown) {
        // Store markdown and metadata
        sessionStorage.setItem(
          `doc_${repo}`,
          JSON.stringify({
            markdown: data.markdown,
            repo: repo,
            fallback: data.fallback || false,
            source: data.source || "deepwiki",
            generatedAt: new Date().toISOString(),
          })
        );

        // Navigate to details page with the repo name
        window.location.href = `/assista-wiki-details?repo=${encodeURIComponent(
          repo
        )}`;
      } else {
        throw new Error(
          "No documentation was generated. The API response was empty."
        );
      }
    } catch (err) {
      console.error("Error generating documentation:", err);
      setError(
        err.message || "Failed to generate documentation. Please try again."
      );
      setGenerating(null);
      setLoading(false);
    }
  };

  const filteredRepo = repos.filter((r) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      r.repo.toLowerCase().includes(term) ||
      r.description.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <Header />
      <div className="cmpad pt-30 slider inslider wslider">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/img/assista-wiki.svg"
                alt=""
                width={60}
                height={60}
              />
              <span className="font-semibold text-4xl text-[#818181]">
                Assista wiki
              </span>
            </div>

            <h1 className="text-5xl font-medium mb-3 leading-15">
              Your assistant to
              <br className="hidden lg:block" /> Organize{" "}
              <span className="brush brushw">knowledge.</span>
            </h1>
            <p className="max-w-[600px] leading-7 text-[#7e7e7e]">
              Assista Wiki helps you create, manage, and access knowledge
              effortlessly. From documentation to team guides and always within
              reach.
            </p>

            <div className="flex gap-2 mt-10 mb-15">
              <a
                href=""
                className="flex justify-center items-center w-45 py-3 bg-[var(--primary-color)] text-white rounded-full hover:bg-[#666] transition duration-300"
              >
                Get Started
              </a>
              <a
                href=""
                className="text-center w-45 py-3 text-[#333] bg-[#94939328] border-[#88848425] border-2 rounded-full hover:bg-[#666] hover:border-[#666] hover:text-white transition duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
          <div>
            <Image
              src="/img/banner.webp"
              alt=""
              width={600}
              height={600}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="cmpad py-10 md:py-20">
        <div style={{ textAlign: "center" }}>
          <span className="badge">Assista Wiki</span>
        </div>

        <h2 className="mainhead relative w-max m-auto">
          Learn more with{" "}
          <span className="underlineimg underlinew">depth AI knowledge</span>
        </h2>

        <p className="leading-7 text-[#7e7e7e] text-center max-w-[750px] mx-auto mb-15 text-lg">
          Explore the Assista Wiki your go-to resource for understanding
          automation and productivity practical insights guides to help you
          master.
        </p>

        <nav className="relative bg-white flex flex-wrap gap-3 justify-center [box-shadow:0px_0px_20px_#00000014] p-3 rounded-full mx-auto mb-4 lg:mb-20  max-w-full w-[800px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 24 24"
            className="absolute left-7 top-0 bottom-0 my-auto text-slate-400"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="m21 21l-3.5-3.5M17 10a7 7 0 1 1-14 0a7 7 0 0 1 14 0Z"
            />
          </svg>

          <input
            type="text"
            className="border border-[#e9e9e9] focus:border-[#949494] focus:outline-none transition duration-300 rounded-full p-3 ps-13 px-5 w-full"
            placeholder="Search repositories (e.g., owner/repo-name)..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </nav>

        {error && (
          <div className="text-center py-4 mb-6">
            <div className="inline-block bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-lg">
              <p className="font-medium">Error: {error}</p>
            </div>
          </div>
        )}

        {filteredRepo.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {filteredRepo.map((repoItem, index) => (
              <article
                key={repoItem.repo || index}
                className="lg:col-span-4 group bg-white rounded-md [box-shadow:0px_0px_20px_#00000014] hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col"
              >
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-medium text-slate-900 mb-3 leading-snug line-clamp-2">
                    {repoItem.repo}
                  </h3>

                  <p className="text-[#7e7e7e] text-sm mb-4 leading-relaxed line-clamp-2 flex-grow">
                    {repoItem.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                      GitHub
                    </span>
                    <button
                      onClick={() => handleGenerateDocs(repoItem.repo)}
                      disabled={generating === repoItem.repo}
                      className={`cursor-pointer inline-flex items-center gap-1.5 text-[#e97d82] text-md font-medium hover:text-[#aa6e71] transition-all ${
                        generating === repoItem.repo
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {generating === repoItem.repo ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-[#e97d82]"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate Docs
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <img
              src="./img/not-found.svg"
              width="300"
              alt="No results found"
              className="mx-auto"
            />
            <div className="text-center py-16">
              <h3 className="text-3xl font-semibold text-slate-700 mb-3">
                No Data Found
              </h3>
              <p className="text-[#7e7e7e] text-lg max-w-[700px] mx-auto leading-relaxed">
                We couldn’t find any results for your search. Try adjusting your
                keywords or browse our latest updates to discover what’s new
                with Assista.
              </p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Page;
