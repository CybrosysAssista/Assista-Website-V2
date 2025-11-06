"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "../components/Header";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5173";

const stripMarkdown = (value) => {
  if (!value) return "";
  return value
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[(.*?)\]\([^)]*\)/g, "$1")
    .replace(/#+\s?/g, "")
    .replace(/>\s?/g, "")
    .trim();
};

const extractDeepWikiLink = (text) => {
  if (!text) return null;
  const match = text.match(/https:\/\/deepwiki\.com\/search\/[A-Za-z0-9_-]+/);
  return match ? match[0] : null;
};

const markdownWrapperClasses = "space-y-3 text-[0.95rem] leading-7 text-slate-800";
const codeBlockClasses = "overflow-x-auto rounded-md border border-slate-200 bg-slate-100 py-1 px-2 text-[0.8rem] text-slate-900 ";

const MarkdownRenderer = ({ content }) => (
  <div className={markdownWrapperClasses}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, children, ...props }) {
          if (inline) {
            return (
              <code
                className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.9rem] font-medium text-slate-900"
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <code className={codeBlockClasses} {...props}>
              {children}
            </code>
          );
        },
        pre({ children, ...props }) {
          return (
            <pre className={codeBlockClasses} {...props}>
              {children}
            </pre>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

function AskPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const repo = searchParams.get("repo") || "";
  const initialQuestion = searchParams.get("question") || "";

  const [inputValue, setInputValue] = useState(initialQuestion);
  const [answerText, setAnswerText] = useState("");
  const [fallback, setFallback] = useState(false);
  const [timestamp, setTimestamp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [structuredContent, setStructuredContent] = useState(null);
  const [deepWikiLink, setDeepWikiLink] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);

  const activeSummary = useMemo(() => {
    if (structuredContent?.overview) {
      return stripMarkdown(structuredContent.overview).slice(0, 400);
    }

    if (structuredContent?.keyPoints?.length) {
      const firstPoint = stripMarkdown(structuredContent.keyPoints[0]);
      if (firstPoint) {
        return firstPoint.slice(0, 400);
      }
    }

    if (answerText) {
      return stripMarkdown(answerText).split("\n").filter(Boolean)[0]?.slice(0, 400) || "";
    }

    return "";
  }, [structuredContent, answerText]);

  const activeKeyPoints = useMemo(() => {
    if (!structuredContent?.keyPoints?.length) return [];
    return structuredContent.keyPoints
      .map((item) => stripMarkdown(item))
      .filter(Boolean)
      .map((item) => item.replace(/^[-*]\s*/, ""));
  }, [structuredContent]);

  const updateUrl = useCallback(
    (question) => {
      const params = new URLSearchParams();
      if (repo) params.set("repo", repo);
      if (question) params.set("question", question);
      router.replace(`/assista-wiki-ask?${params.toString()}`, { scroll: false });
    },
    [repo, router]
  );

  const performAsk = useCallback(
    async (question, { skipUrlUpdate = false } = {}) => {
      const trimmed = question.trim();
      if (!repo || !trimmed) return;

      if (!skipUrlUpdate) {
        updateUrl(trimmed);
      }

      setError(null);
      setFallback(false);
      setAnswerText("");
      setTimestamp(null);
      setStructuredContent(null);
      setDeepWikiLink(null);

      const requestId = crypto.randomUUID();

      setConversations((prev) => {
        const filtered = prev.filter(
          (conv) => conv.question.toLowerCase() !== trimmed.toLowerCase()
        );
        return [
          {
            id: requestId,
            question: trimmed,
            answer: "",
            fallback: false,
            timestamp: null,
            structuredContent: null,
            deepWikiLink: null,
            status: "loading",
            errorMessage: null,
          },
          ...filtered,
        ];
      });
      setActiveConversationId(requestId);
      setLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/api/ask`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ repo, question: trimmed }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to get answer");
        }

        const data = await response.json();
        if (data.success === false && data.error) {
          throw new Error(data.error);
        }

        setAnswerText(data.answer || "No answer returned.");
        setFallback(Boolean(data.fallback || data.source === "local_analysis"));
        setTimestamp(
          data.metadata?.timestamp || new Date().toISOString()
        );
        setStructuredContent(data.deepwiki_content || null);
        setDeepWikiLink(extractDeepWikiLink(data.answer));

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === requestId
              ? {
                  ...conv,
                  answer: data.answer || "No answer returned.",
                  fallback: Boolean(data.fallback || data.source === "local_analysis"),
                  timestamp: data.metadata?.timestamp || new Date().toISOString(),
                  structuredContent: data.deepwiki_content || null,
                  deepWikiLink: extractDeepWikiLink(data.answer),
                  status: "success",
                  errorMessage: null,
                }
              : conv
          )
        );

      } catch (askError) {
        setError(
          askError instanceof Error
            ? askError.message
            : "Something went wrong while fetching the answer."
        );
        setStructuredContent(null);
        setDeepWikiLink(null);
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === requestId
              ? {
                  ...conv,
                  status: "error",
                  errorMessage:
                    askError instanceof Error
                      ? askError.message
                      : "Something went wrong while fetching the answer.",
                }
              : conv
          )
        );
      } finally {
        setLoading(false);
      }
    },
    [repo, updateUrl]
  );

  useEffect(() => {
    if (repo && initialQuestion) {
      performAsk(initialQuestion, { skipUrlUpdate: true });
    }
  }, [repo, initialQuestion, performAsk]);

  const handleSubmit = () => {
    if (!repo || !inputValue.trim()) return;
    performAsk(inputValue);
    setInputValue("");
  };

  const handleCopy = async () => {
    if (!answerText) return;
    try {
      await navigator.clipboard.writeText(answerText);
    } catch (err) {
      console.error("Failed to copy answer", err);
    }
  };

  const activeConversation = useMemo(
    () => conversations.find((conv) => conv.id === activeConversationId) || null,
    [conversations, activeConversationId]
  );

  useEffect(() => {
    if (activeConversation) {
      setAnswerText(activeConversation.answer);
      setFallback(activeConversation.fallback);
      setTimestamp(activeConversation.timestamp);
      setStructuredContent(activeConversation.structuredContent);
      setDeepWikiLink(activeConversation.deepWikiLink);
    }
  }, [activeConversation]);

  const summaryText = activeSummary;
  const keyPointItems = activeKeyPoints;

  if (!repo) {
    return (
      <div>
        <Header />
        <div className="cmpad mt-72">
          <div className="max-w-2xl mx-auto text-center py-20">
            <h1 className="text-2xl font-semibold text-slate-800 mb-4">
              Repository not specified
            </h1>
            <p className="text-slate-500 mb-6">
              Please return to the wiki page and choose a repository before asking
              questions.
            </p>
            <button
              type="button"
              className="px-6 py-3 rounded-full bg-(--primary-color) text-white"
              onClick={() => router.push("/assista-wiki")}
            >
              Back to Wiki
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div className="cmpad mt-32">
        <div className="max-w-6xl mx-auto px-4 pb-36">
          <button
            type="button"
            className="text-sm text-slate-500 hover:text-slate-700 transition"
            onClick={() => router.push(`/assista-wiki-details?repo=${encodeURIComponent(repo)}`)}
          >
            ← Back to repository wiki
          </button>

          <div className="mt-6 flex flex-col gap-8 lg:flex-row">
            <section className="flex-1 min-w-0">
              <div className="rounded-3xl border border-[#dcdcdc] bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-slate-500">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                    Ask Mode
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                    {repo}
                  </span>
                </div>

                <div className="mt-6 flex flex-col gap-6">
                  <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--primary-color) text-white">
                      Q
                    </div>
                    <div className="flex-1">
                      <h2 className="text-sm font-semibold text-slate-800">
                        {conversations.find((conv) => conv.id === activeConversationId)?.question ||
                          initialQuestion ||
                          "Ask documentation about this repository"}
                      </h2>
                      {activeConversation?.status === "loading" && (
                        <p className="text-xs text-slate-400">Waiting for response…</p>
                      )}
                      {activeConversation?.status === "error" && (
                        <p className="text-xs text-red-500">Failed to fetch answer.</p>
                      )}
                      {activeConversation?.status === "success" && timestamp && !loading && !error && (
                        <p className="text-xs text-slate-400">
                          Answered at {new Date(timestamp).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {loading && (
                      <div className="space-y-4">
                        <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200" />
                        <div className="space-y-3">
                          {[...Array(4)].map((_, idx) => (
                            <div
                              key={`skeleton-line-${idx}`}
                              className="h-3 animate-pulse rounded-full bg-slate-200"
                              style={{ width: `${90 - idx * 8}%` }}
                            />
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
                          <div className="h-3 w-16 animate-pulse rounded-full bg-slate-200" />
                        </div>
                      </div>
                    )}
                    {error && !loading && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                      </div>
                    )}
                    {!loading && !error && (
                      structuredContent ? (
                        <div className="space-y-6">
                          {summaryText && (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                              {summaryText}
                            </div>
                          )}

                          {keyPointItems.length > 0 && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                              <h3 className="text-sm font-semibold text-slate-800">
                                Key Points
                              </h3>
                              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                                {keyPointItems.map((point, idx) => (
                                  <li key={`key-point-${idx}`} className="flex gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-(--primary-color)" />
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {structuredContent.implementationDetails && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                              <h3 className="text-sm font-semibold text-slate-800">
                                Implementation Details
                              </h3>
                              <div className="mt-3">
                                <MarkdownRenderer content={structuredContent.implementationDetails || ""} />
                              </div>
                            </div>
                          )}

                          {answerText && (
                            <details className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                              <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-700">
                                View full response
                              </summary>
                              <div className="px-4 pb-4 pt-2">
                                <MarkdownRenderer content={answerText} />
                              </div>
                            </details>
                          )}
                        </div>
                      ) : answerText ? (
                        <MarkdownRenderer content={answerText} />
                      ) : (
                        <div className="text-sm text-slate-500">
                          Ask a question about this repository to see DeepWiki’s explanation here.
                        </div>
                      )
                    )}
                    {!loading && !error && deepWikiLink && (
                      <a
                        href={deepWikiLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-medium text-(--primary-color)"
                      >
                        View detailed discussion on DeepWiki
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M10 20v-2h6.6L4 5.4L5.4 4L18 16.6V10h2v10z"
                          />
                        </svg>
                      </a>
                    )}
                    {fallback && !loading && !error && (
                      <p className="text-xs text-amber-600">
                        Generated from local analysis because DeepWiki doesn’t have this
                        repository indexed yet.
                      </p>
                    )}
                    {timestamp && !loading && !error && (
                      <p className="text-xs text-slate-400">
                        Answered at {new Date(timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                    onClick={handleCopy}
                    disabled={!answerText}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M8 3h9a2 2 0 0 1 2 2v11h-2V5H8z"
                      />
                      <path
                        fill="currentColor"
                        d="M5 7h9a2 2 0 0 1 2 2v11H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2m0 2v9h9V9z"
                      />
                    </svg>
                    Copy answer
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                    onClick={() => router.push(`https://github.com/${repo}`)}
                  >
                    View on GitHub
                  </button>
                </div>
              </div>
            </section>
            <aside className="w-full shrink-0 lg:w-[320px]">
              <div className="rounded-3xl border border-[#dcdcdc] bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-800">Conversation history</h2>
                <p className="mt-2 text-xs text-slate-500">
                  Previous questions in this session.
                </p>
                <ul className="mt-4 space-y-2">
                  {conversations.map((conv) => {
                    const isActive = conv.id === activeConversationId;
                    return (
                      <li key={conv.id}>
                        <button
                          type="button"
                          className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                            isActive
                              ? "border-(--primary-color) bg-(--primary-color)/10 text-(--primary-color)"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                          }`}
                          onClick={() => {
                            setActiveConversationId(conv.id);
                            setAnswerText(conv.answer);
                            setFallback(conv.fallback);
                            setTimestamp(conv.timestamp);
                            setStructuredContent(conv.structuredContent);
                            setDeepWikiLink(conv.deepWikiLink);
                            setError(conv.status === "error" ? conv.errorMessage : null);
                            setLoading(conv.status === "loading");
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="flex-1 truncate font-medium">
                              {conv.question}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                              {conv.status === "loading" && (
                                <svg
                                  className="h-4 w-4 animate-spin text-slate-400"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M12 4V2q2.075 0 3.9.788t3.175 2.137L17.65 6.35Q16.6 5.3 15.3 4.65T12 4"
                                  />
                                </svg>
                              )}
                              {conv.status === "error" && (
                                <svg
                                  className="h-4 w-4 text-red-500"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20m-.75 5h1.5v6h-1.5zm.75 11.75a1.25 1.25 0 1 1 0 2.5a1.25 1.25 0 0 1 0-2.5"
                                  />
                                </svg>
                              )}
                              {conv.status === "success" && conv.timestamp && (
                                new Date(conv.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              )}
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                  {conversations.length === 0 && !loading && (
                    <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                      Your questions will appear here.
                    </li>
                  )}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e4e4e4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">

          <div className="flex-1">
            <input
              type="text"
              placeholder="Ask a follow-up question…"
              className="w-full rounded-full border border-transparent bg-slate-100 px-5 py-3 text-sm focus:border-slate-300 focus:outline-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              disabled={loading}
            />
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-(--primary-color) text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleSubmit}
            disabled={loading || !inputValue.trim()}
            aria-label="Submit follow-up question"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M4 20v-5.4l7.175-2.6L4 9.4V4l17 7z"
              />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}

export default AskPage;

