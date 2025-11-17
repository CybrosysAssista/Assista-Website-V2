"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Header from "../components/Header";
import Footer from "../components/Footer";

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.0.20.51:5173";

function page() {
  const [activeSection, setActiveSection] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [repo, setRepo] = useState("");
  const [sections, setSections] = useState([]);
  const [question, setQuestion] = useState("");
  const [activePageId, setActivePageId] = useState("");
  const [showDiagramsView, setShowDiagramsView] = useState(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const downloadMenuRef = useRef(null);

  const MERMAID_CDN_SRC =
    "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";

  const ensureMermaidForPdf = () =>
    new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        resolve(null);
        return;
      }

      const initialise = () => {
        if (!window.mermaid) {
          reject(new Error("Mermaid failed to load"));
          return;
        }
        window.mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          flowchart: { useMaxWidth: true, htmlLabels: true },
          fontFamily: "Inter, sans-serif",
        });
        resolve(window.mermaid);
      };

      if (window.mermaid) {
        initialise();
        return;
      }

      const existingScript = document.querySelector(
        'script[data-mermaid-pdf="true"]'
      );
      if (existingScript) {
        existingScript.addEventListener("load", initialise, { once: true });
        existingScript.addEventListener(
          "error",
          () => reject(new Error("Failed to load mermaid for PDF")),
          { once: true }
        );
        return;
      }

      const script = document.createElement("script");
      script.src = MERMAID_CDN_SRC;
      script.async = true;
      script.dataset.mermaidPdf = "true";
      script.addEventListener("load", initialise, { once: true });
      script.addEventListener(
        "error",
        () => reject(new Error("Failed to load mermaid for PDF")),
        { once: true }
      );
      document.head.appendChild(script);
    });

  const renderMermaidDiagramsForPdf = async (container) => {
    const mermaidBlocks = Array.from(container.querySelectorAll(".mermaid"));
    if (mermaidBlocks.length === 0) return;

    await ensureMermaidForPdf();

    await Promise.allSettled(
      mermaidBlocks.map(async (block, index) => {
        const code = block.textContent || "";
        try {
          const { svg } = await window.mermaid.render(
            `pdf-mermaid-${Date.now()}-${index}`,
            code
          );
          block.innerHTML = svg;
          block.classList.add("mermaid-rendered");
        } catch (error) {
          console.error("Failed to render mermaid diagram for PDF", error);
          block.innerHTML = `<pre class="mermaid-error">${code}</pre>`;
        }
      })
    );
  };

  const decodeHtmlEntities = (value) =>
    value
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"');

  const generateStyledPdfFromMarkdown = async (markdownText, fileBaseName) => {
    const [{ default: html2pdf }, { marked }] = await Promise.all([
      import("html2pdf.js"),
      import("marked"),
    ]);

    const renderedHtml = marked.parse(markdownText, {
      gfm: true,
      breaks: true,
    });

    const htmlWithMermaid = renderedHtml.replace(
      /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
      (_match, code) => {
        const cleaned = decodeHtmlEntities(code)
          .replace(/^\s+|\s+$/g, "")
          .replace(/<br\s*\/?>(\n)?/g, "\n");
        return `<div class="mermaid">${cleaned}</div>`;
      }
    );

    const container = document.createElement("div");
    container.className = "pdf-export-root";
    container.style.position = "fixed";
    container.style.left = "-10000px";
    container.style.top = "0";
    container.style.width = "794px"; // A4 width in px at 96 DPI
    container.style.padding = "0";
    container.style.background = "#ffffff";

    const pdfStyles = `
      .pdf-export-root {
        color: #0f172a;
        font-family: "Inter", "Segoe UI", sans-serif;
      }
      .pdf-export-root .pdf-document {
        padding: 32px 40px;
        line-height: 1.55;
        font-size: 13px;
      }
      .pdf-export-root h1,
      .pdf-export-root h2,
      .pdf-export-root h3,
      .pdf-export-root h4 {
        color: #111827;
        margin-top: 28px;
        margin-bottom: 12px;
        line-height: 1.25;
        page-break-after: avoid;
      }
      .pdf-export-root h1 { font-size: 28px; }
      .pdf-export-root h2 { font-size: 22px; }
      .pdf-export-root h3 { font-size: 18px; }
      .pdf-export-root h4 { font-size: 16px; }
      .pdf-export-root p {
        margin: 0 0 14px;
        color: #1f2937;
      }
      .pdf-export-root ul,
      .pdf-export-root ol {
        margin: 0 0 16px 24px;
      }
      .pdf-export-root li {
        margin-bottom: 6px;
      }
      .pdf-export-root pre {
        background: #0f172a;
        color: #f8fafc;
        padding: 14px 18px;
        border-radius: 10px;
        font-size: 12px;
        overflow-x: auto;
        margin: 18px 0;
      }
      .pdf-export-root code {
        background: rgba(15, 23, 42, 0.08);
        padding: 2px 6px;
        border-radius: 6px;
        font-family: "Fira Code", "SFMono-Regular", Consolas, monospace;
      }
      .pdf-export-root pre code {
        background: transparent;
        padding: 0;
      }
      .pdf-export-root table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      .pdf-export-root th,
      .pdf-export-root td {
        border: 1px solid #e5e7eb;
        padding: 10px 12px;
        text-align: left;
      }
      .pdf-export-root th {
        background: #f9fafb;
        font-weight: 600;
      }
      .pdf-export-root blockquote {
        border-left: 4px solid #6366f1;
        background: rgba(99, 102, 241, 0.08);
        padding: 12px 18px;
        margin: 20px 0;
        color: #312e81;
      }
      .pdf-export-root .mermaid {
        margin: 24px auto;
        padding: 16px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        text-align: center;
      }
      .pdf-export-root .mermaid svg {
        width: 100%;
        height: auto;
      }
      .pdf-export-root .mermaid-error {
        background: rgba(239, 68, 68, 0.1);
        color: #991b1b;
        padding: 12px;
        border-radius: 8px;
        white-space: pre-wrap;
      }
      .pdf-export-root img {
        max-width: 100%;
        height: auto;
      }
      .pdf-export-root .page-break {
        page-break-before: always;
      }
    `;

    container.innerHTML = `
      <style>${pdfStyles}</style>
      <article class="pdf-document">${htmlWithMermaid}</article>
    `;

    document.body.appendChild(container);

    try {
      await renderMermaidDiagramsForPdf(container);

      const options = {
        margin: [20, 18, 32, 18],
        filename: `${fileBaseName}.pdf`,
        pagebreak: { mode: ["css", "legacy"] },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "pt",
          format: "a4",
          orientation: "portrait",
        },
      };

      await html2pdf().set(options).from(container).save();
    } finally {
      document.body.removeChild(container);
    }
  };
  const router = useRouter();

  // Shared slugify to keep IDs consistent between parsing and rendering
  const slugifyTitle = (text) => {
    if (!text) return "";
    return String(text)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Extract repo from URL query parameter and load documentation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const repoParam = params.get("repo");
    if (repoParam) {
      setRepo(repoParam);
      loadDocumentation(repoParam);
    } else {
      setError("No repository specified");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        downloadMenuRef.current &&
        !downloadMenuRef.current.contains(event.target)
      ) {
        setDownloadMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load documentation from sessionStorage or API
  const loadDocumentation = async (repoName) => {
    try {
      setLoading(true);
      setError(null);

      // Try to get from sessionStorage first
      const stored = sessionStorage.getItem(`doc_${repoName}`);
      if (stored) {
        const docData = JSON.parse(stored);
        setMarkdown(docData.markdown);
        parseMarkdownToSections(docData.markdown);
        setLoading(false);
        return;
      }

      // If not in sessionStorage, fetch from API
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repo: repoName }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch documentation: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.markdown) {
        setMarkdown(data.markdown);
        parseMarkdownToSections(data.markdown);
        // Store in sessionStorage for future use
        sessionStorage.setItem(
          `doc_${repoName}`,
          JSON.stringify({
            markdown: data.markdown,
            repo: repoName,
            fallback: data.fallback || false,
            source: data.source || "deepwiki",
            generatedAt: new Date().toISOString(),
          })
        );
      } else {
        throw new Error("No markdown content received from API");
      }
    } catch (err) {
      console.error("Error loading documentation:", err);
      setError(
        err.message || "Failed to load documentation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format) => {
    if (!repo) return;
    const normalizedFormat = format === "pdf" ? "pdf" : "md";
    const repoSegments = repo.split("/");
    const encodedRepo = repoSegments
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    const safeBaseName =
      repoSegments[repoSegments.length - 1]?.replace(/[^a-zA-Z0-9._-]+/g, "-") ||
      "documentation";

    try {
      setDownloadMenuOpen(false);
      const response = await fetch(`/api/download/${encodedRepo}/${normalizedFormat}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        const message = (() => {
          try {
            const parsed = JSON.parse(errorText);
            return (
              parsed?.details?.error ||
              parsed?.details ||
              parsed?.error ||
              "Failed to download documentation. Please try again."
            );
          } catch {
            return "Failed to download documentation. Please try again.";
          }
        })();

        // If the PDF generation fails, fall back to Markdown and create a PDF client-side
        if (normalizedFormat === "pdf") {
          console.warn("PDF download failed, falling back to Markdown", errorText);
          const markdownResponse = await fetch(`/api/download/${encodedRepo}/md`, {
            method: "GET",
            credentials: "include",
          });

          if (markdownResponse.ok) {
            const markdownText = await markdownResponse.text();
            await generateStyledPdfFromMarkdown(markdownText, safeBaseName);
            return;
          }
        }

        console.error("Download failed", errorText);
        alert(message);
        return;
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${safeBaseName}.${normalizedFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Unexpected error downloading documentation", error);
      alert("Unexpected error downloading documentation. Please try again.");
    }
  };

  // Parse markdown to extract pages (split by H1 headers) and sections for TOC
  const buildPages = (md) => {
    if (!md) {
      const overviewPage = {
        id: "overview",
        title: "Overview",
        content: md || "No content available",
      };
      setPages([overviewPage]);
      setActivePageId("overview");
      setSections([]);
      setActiveSection("");
      return;
    }

    const lines = md.split("\n");
    const builtPages = [];
    const extractedSections = [];
    const seenIds = new Set();
    let insideCodeBlock = false;
    let currentPage = null;
    let currentContent = [];

    lines.forEach((line) => {
      // Check if we're entering or exiting a code block
      const codeBlockStart = line.match(/^```/);
      if (codeBlockStart) {
        insideCodeBlock = !insideCodeBlock;
        currentContent.push(line);
        return;
      }

      const headerMatch = line.match(/^(#{1,4})\s+(.+)$/);

      if (headerMatch && !insideCodeBlock) {
        const hashes = headerMatch[1];
        let title = headerMatch[2].trim();
        const level = hashes.length;

        // If it's an H1, start a new page
        if (level === 1) {
          // Skip lines that start with "Page:" - these are not actual page titles
          if (title.match(/^Page:/i)) {
            return;
          }

          // Save previous page
          if (currentPage) {
            currentPage.content = currentContent.join("\n");
            builtPages.push(currentPage);
          }

          // Start new page
          const pageId = slugifyTitle(title) || `page-${builtPages.length}`;
          currentPage = {
            id: pageId,
            title,
            content: "",
          };
          currentContent = [line]; // Include the H1 in the content
        } else {
          // For non-H1 headers, add to TOC sections
          currentContent.push(line);

          let baseId =
            slugifyTitle(title) || `section-${extractedSections.length}`;
          let finalId = baseId;
          let counter = 1;
          while (seenIds.has(finalId)) {
            finalId = `${baseId}-${counter}`;
            counter++;
          }
          seenIds.add(finalId);
          extractedSections.push({
            id: finalId,
            title,
            level,
            pageId: currentPage ? currentPage.id : "overview",
          });
        }
      } else {
        currentContent.push(line);
      }
    });

    // Save the last page
    if (currentPage) {
      currentPage.content = currentContent.join("\n");
      builtPages.push(currentPage);
    }

    // If no pages were created, create a single overview page
    if (builtPages.length === 0) {
      builtPages.push({
        id: "overview",
        title: "Overview",
        content: md,
      });
    }

    setPages(builtPages);
    setActivePageId(builtPages[0].id);
    setSections(extractedSections);
    if (extractedSections.length > 0) {
      setActiveSection(extractedSections[0].id);
    }
  };

  const parseMarkdownToSections = (md) => {
    // This is now handled by buildPages
    buildPages(md);
  };

  // Custom components for react-markdown
  const components = useMemo(
    () => ({
      // Handle code blocks - special handling for Mermaid
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        const language = match ? match[1] : "";
        const codeString = String(children).replace(/\n$/, "");

        if (!inline && language === "mermaid") {
          // Replace Mermaid diagrams with a placeholder button
          return (
            <button
              onClick={() => setShowDiagramsView(true)}
              className="w-fit flex items-center justify-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg transition my-4 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12c0 1.11-.89 2-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m9 17v-6H6v6h9m-9 2h9v2H6v-2Z"
                />
              </svg>
              View Diagrams
            </button>
          );
        }

        // Regular code blocks
        if (!inline && match) {
          return (
            <pre className="code-block">
              <code className={className} {...props}>
                {codeString}
              </code>
            </pre>
          );
        }

        // If inline code but no language specified
        if (inline && !match) {
          return (
            <code className="inline-code" {...props}>
              {children}
            </code>
          );
        }

        // Inline code
        return (
          <code className="inline-code" {...props}>
            {children}
          </code>
        );
      },
      // Headers with IDs for navigation
      h1({ node, children, ...props }) {
        // Extract text from children recursively to build stable IDs
        const toText = (nodes) => {
          if (!nodes) return "";
          if (typeof nodes === "string") return nodes;
          if (Array.isArray(nodes)) return nodes.map((n) => toText(n)).join("");
          if (typeof nodes === "object" && nodes.props)
            return toText(nodes.props.children);
          return "";
        };
        const text = toText(children);
        const id = slugifyTitle(text) || "overview";
        return (
          <h1 className="main-title" id={id} {...props}>
            {children}
          </h1>
        );
      },
      h2({ node, children, ...props }) {
        const toText = (nodes) => {
          if (!nodes) return "";
          if (typeof nodes === "string") return nodes;
          if (Array.isArray(nodes)) return nodes.map((n) => toText(n)).join("");
          if (typeof nodes === "object" && nodes.props)
            return toText(nodes.props.children);
          return "";
        };
        const text = toText(children);
        const id = slugifyTitle(text) || `h2-${Date.now()}`;
        return (
          <h2 className="section-title" id={id} {...props}>
            {children}
          </h2>
        );
      },
      h3({ node, children, ...props }) {
        const toText = (nodes) => {
          if (!nodes) return "";
          if (typeof nodes === "string") return nodes;
          if (Array.isArray(nodes)) return nodes.map((n) => toText(n)).join("");
          if (typeof nodes === "object" && nodes.props)
            return toText(nodes.props.children);
          return "";
        };
        const text = toText(children);
        const id = slugifyTitle(text) || `h3-${Date.now()}`;
        return (
          <h3 className="section-title" id={id} {...props}>
            {children}
          </h3>
        );
      },
      h4({ node, children, ...props }) {
        const toText = (nodes) => {
          if (!nodes) return "";
          if (typeof nodes === "string") return nodes;
          if (Array.isArray(nodes)) return nodes.map((n) => toText(n)).join("");
          if (typeof nodes === "object" && nodes.props)
            return toText(nodes.props.children);
          return "";
        };
        const text = toText(children);
        const id = slugifyTitle(text) || `h4-${Date.now()}`;
        return (
          <h4 className="section-title" id={id} {...props}>
            {children}
          </h4>
        );
      },
      // Tables
      table({ node, children, ...props }) {
        return (
          <div style={{ overflowX: "auto", margin: "1.5rem 0" }}>
            <table className="markdown-table" {...props}>
              {children}
            </table>
          </div>
        );
      },
      thead({ node, children, ...props }) {
        return <thead {...props}>{children}</thead>;
      },
      tbody({ node, children, ...props }) {
        return <tbody {...props}>{children}</tbody>;
      },
      tr({ node, children, ...props }) {
        return <tr {...props}>{children}</tr>;
      },
      th({ node, children, ...props }) {
        return <th {...props}>{children}</th>;
      },
      td({ node, children, ...props }) {
        return <td {...props}>{children}</td>;
      },
      // Links
      a({ node, children, href, ...props }) {
        // If the href looks like a relative file path (e.g., addons/account/models/account_move.py)
        // and we have a repo, convert it to a GitHub URL
        let finalHref = href || "";

        // If href is empty, try to extract from children text
        if (!finalHref && children) {
          const childText =
            typeof children === "string"
              ? children
              : Array.isArray(children)
              ? children.map((c) => (typeof c === "string" ? c : "")).join("")
              : "";
          if (childText) {
            finalHref = childText;
          }
        }

        if (
          finalHref &&
          repo &&
          !finalHref.startsWith("http") &&
          !finalHref.startsWith("#")
        ) {
          // Handle format like "README.md:8-15" or "file.py:10-20"
          const parts = finalHref.split(":");
          const filePath = parts[0].trim();
          const lineRange =
            parts.length > 1 ? `#L${parts[1].trim().replace("-", "-L")}` : "";

          // Only process if it looks like a file path
          if (filePath && (filePath.includes(".") || filePath.includes("/"))) {
            // Use blob for files with line ranges, tree for directories
            if (lineRange) {
              finalHref = `https://github.com/${repo}/blob/master/${filePath}${lineRange}`;
            } else {
              // Check if it's likely a file (has extension) or directory
              const hasExtension = /\.\w+$/.test(filePath);
              if (hasExtension) {
                finalHref = `https://github.com/${repo}/blob/master/${filePath}`;
              } else {
                finalHref = `https://github.com/${repo}/tree/master/${filePath}`;
              }
            }
          }
        }

        // Don't render link if href is still empty
        if (!finalHref) {
          return <span {...props}>{children}</span>;
        }

        return (
          <a
            className="inline-link"
            target="_blank"
            rel="noopener noreferrer"
            href={finalHref}
            {...props}
          >
            {children}
          </a>
        );
      },
      // Blockquotes
      blockquote({ node, children, ...props }) {
        return (
          <blockquote className="markdown-blockquote" {...props}>
            {children}
          </blockquote>
        );
      },
      // Horizontal rules
      hr({ node, ...props }) {
        return <hr className="markdown-hr" {...props} />;
      },
      // Lists
      ul({ node, children, ...props }) {
        return (
          <ul className="subsection-list" {...props}>
            {children}
          </ul>
        );
      },
      ol({ node, children, ...props }) {
        return (
          <ol className="subsection-list" {...props}>
            {children}
          </ol>
        );
      },
      li({ node, children, ...props }) {
        return (
          <li className="list-item" {...props}>
            {children}
          </li>
        );
      },
      // Paragraphs
      p({ node, children, ...props }) {
        // Check if this is a "Sources:" paragraph with links
        if (Array.isArray(children) && children.length > 0) {
          let hasSources = false;
          const firstChild = children[0];

          // Check if first child is strong with "Sources:" or if first text node contains "Sources:"
          if (
            typeof firstChild === "object" &&
            firstChild?.type === "strong" &&
            typeof firstChild.props?.children === "string" &&
            firstChild.props.children.includes("Sources:")
          ) {
            hasSources = true;
          } else if (
            typeof firstChild === "string" &&
            firstChild.includes("Sources:")
          ) {
            hasSources = true;
          }

          if (hasSources) {
            // Extract all links from children and convert to full GitHub URLs
            const links = [];
            children.forEach((child) => {
              if (typeof child === "object" && child?.type === "a") {
                const href = child.props?.href || "";

                // Extract link text - could be a string or more complex structure
                let linkText = "";
                if (typeof child.props?.children === "string") {
                  linkText = child.props.children;
                } else if (Array.isArray(child.props?.children)) {
                  // Flatten array to get text
                  linkText = child.props.children
                    .map((c) => (typeof c === "string" ? c : ""))
                    .join("");
                }

                // Use linkText as fallback if href is empty
                const sourceText = href || linkText;

                // Convert to full GitHub URL if we have a repo
                let finalHref = href;
                if (
                  repo &&
                  sourceText &&
                  !sourceText.startsWith("http") &&
                  !sourceText.startsWith("#")
                ) {
                  // Handle format like "README.md:8-15" or just "README.md"
                  const parts = sourceText.split(":");
                  const filePath = parts[0].trim();
                  const lineRange =
                    parts.length > 1
                      ? `#L${parts[1].trim().replace("-", "-L")}`
                      : "";

                  // Only process if filePath looks like a file path
                  if (
                    filePath &&
                    (filePath.includes(".") || filePath.includes("/"))
                  ) {
                    // Use blob instead of tree to link to specific lines
                    if (lineRange) {
                      finalHref = `https://github.com/${repo}/blob/master/${filePath}${lineRange}`;
                    } else {
                      finalHref = `https://github.com/${repo}/blob/master/${filePath}`;
                    }
                  } else {
                    // If we can't determine the URL, keep the original href (or empty)
                    finalHref = href || sourceText;
                  }
                } else if (!repo) {
                  // No repo available, can't build URL
                  finalHref = href || sourceText;
                }

                links.push({
                  href: finalHref,
                  text: linkText || sourceText || href,
                });
              }
            });

            if (links.length > 0) {
              return (
                <div className="mt-4">
                  <p className="section-text mb-2">
                    <strong>Sources:</strong>
                  </p>
                  <ul className="list-disc space-y-1 pl-6">
                    {links.map((link, idx) => (
                      <li key={idx}>
                        <a
                          className="inline-link"
                          target="_blank"
                          rel="noopener noreferrer"
                          href={link.href}
                        >
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
          }
        }

        // Don't wrap code blocks or images in paragraph
        if (
          Array.isArray(children) &&
          children.some(
            (child) =>
              typeof child === "object" &&
              child !== null &&
              (child.type === "code" ||
                child.props?.className?.includes("code-block") ||
                child.type === "img" ||
                child.type === "div")
          )
        ) {
          return <>{children}</>;
        }
        return (
          <p className="section-text" {...props}>
            {children}
          </p>
        );
      },
      // Images
      img({ node, ...props }) {
        return (
          <img className="markdown-image" {...props} alt={props.alt || ""} />
        );
      },
      // Strong/Bold
      strong({ node, children, ...props }) {
        return <strong {...props}>{children}</strong>;
      },
      // Emphasis/Italic
      em({ node, children, ...props }) {
        return <em {...props}>{children}</em>;
      },
      // Details/Summary (collapsible sections)
      details({ node, children, ...props }) {
        return (
          <details className="markdown-details" {...props}>
            {children}
          </details>
        );
      },
      summary({ node, children, ...props }) {
        return (
          <summary className="markdown-summary" {...props}>
            {children}
          </summary>
        );
      },
    }),
    [repo]
  );

  // Function to sanitize markdown and handle unknown HTML tags
  const sanitizeMarkdown = (md) => {
    if (!md) return md;

    // Convert unknown/custom HTML tags to divs with data attributes
    // This prevents React errors for unrecognized tags like <capturedvalue>
    let sanitized = md.replace(
      /<(\/?)([a-z][a-z0-9]*)\s*([^>]*)>/gi,
      (match, closing, tagName, attributes) => {
        // List of known HTML tags that React recognizes
        const knownTags = new Set([
          "a",
          "abbr",
          "address",
          "area",
          "article",
          "aside",
          "audio",
          "b",
          "base",
          "bdi",
          "bdo",
          "big",
          "blockquote",
          "body",
          "br",
          "button",
          "canvas",
          "caption",
          "cite",
          "code",
          "col",
          "colgroup",
          "data",
          "datalist",
          "dd",
          "del",
          "details",
          "dfn",
          "dialog",
          "div",
          "dl",
          "dt",
          "em",
          "embed",
          "fieldset",
          "figcaption",
          "figure",
          "footer",
          "form",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "head",
          "header",
          "hgroup",
          "hr",
          "html",
          "i",
          "iframe",
          "img",
          "input",
          "ins",
          "kbd",
          "label",
          "legend",
          "li",
          "link",
          "main",
          "map",
          "mark",
          "menu",
          "meta",
          "meter",
          "nav",
          "noscript",
          "object",
          "ol",
          "optgroup",
          "option",
          "output",
          "p",
          "param",
          "picture",
          "pre",
          "progress",
          "q",
          "rp",
          "rt",
          "ruby",
          "s",
          "samp",
          "script",
          "section",
          "select",
          "small",
          "source",
          "span",
          "strong",
          "style",
          "sub",
          "summary",
          "sup",
          "table",
          "tbody",
          "td",
          "template",
          "textarea",
          "tfoot",
          "th",
          "thead",
          "time",
          "title",
          "tr",
          "track",
          "u",
          "ul",
          "var",
          "video",
          "wbr",
        ]);

        const lowerTagName = tagName.toLowerCase();

        // If it's a closing tag or known tag, return as-is
        if (closing) {
          if (knownTags.has(lowerTagName)) {
            return match;
          } else {
            // Convert unknown closing tag to closing div
            return "</div>";
          }
        }

        // For opening tags
        if (knownTags.has(lowerTagName)) {
          return match;
        }

        // Convert unknown opening tags to div with data attribute
        const cleanAttributes = attributes.trim();
        return `<div data-original-tag="${lowerTagName}"${
          cleanAttributes ? " " + cleanAttributes : ""
        }>`;
      }
    );

    return sanitized;
  };

  // All markdown parsing is now handled by ReactMarkdown with remark-gfm

  // Scroll to top when page changes
  useEffect(() => {
    if (!activePageId) return;

    // Small delay to ensure content is rendered
    const timeoutId = setTimeout(() => {
      const contentContainer = document.querySelector(".wiki-main-content");
      if (contentContainer) {
        contentContainer.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [activePageId]);

  // Set up intersection observer for sections (after markdown is rendered)
  useEffect(() => {
    if (sections.length === 0 || !markdown) return;

    // Defer to allow ReactMarkdown to render headings
    const timeoutId = setTimeout(() => {
      const container = document.querySelector(".markdown-content");
      if (!container) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          threshold: 0.3,
          rootMargin: "-100px 0px -50% 0px",
        }
      );

      // Observe actual headings present in DOM
      const headingIds = new Set(sections.map((s) => s.id));
      const headings = container.querySelectorAll(
        "h1[id], h2[id], h3[id], h4[id]"
      );
      headings.forEach((el) => {
        if (headingIds.has(el.id)) observer.observe(el);
      });

      return () => {
        observer.disconnect();
      };
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [sections, markdown]);

  // Load and initialize Mermaid.js for diagram rendering
  useEffect(() => {
    if (!markdown) return;

    // Function to extract and set Mermaid code from data attributes to textContent
    const prepareMermaidDiagrams = () => {
      const mermaidElements = document.querySelectorAll(
        ".mermaid[data-mermaid-code]"
      );
      mermaidElements.forEach((element) => {
        const encodedCode = element.getAttribute("data-mermaid-code");
        if (encodedCode) {
          try {
            // Decode HTML entities in the attribute value
            const htmlDecoded = encodedCode
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'");
            // Decode from Base64 (properly handle Unicode)
            const decodedCode = decodeURIComponent(escape(atob(htmlDecoded)));
            // Set as textContent so Mermaid can read it properly
            element.textContent = decodedCode;
            // Remove the data attribute after setting textContent
            element.removeAttribute("data-mermaid-code");
            // Show the mermaid element
            element.style.display = "block";
          } catch (e) {
            console.error("Error decoding Mermaid code:", e, encodedCode);
            // Show error state
            const loadingElement =
              element.parentElement?.querySelector(".mermaid-loading");
            if (loadingElement) {
              loadingElement.innerHTML =
                '<p style="color: #ef4444;">Error loading diagram</p>';
            }
          }
        }
      });
      return mermaidElements.length;
    };

    // Function to hide loading indicators after render
    const hideLoadingIndicators = () => {
      const mermaidElements = document.querySelectorAll(
        ".mermaid:not([data-mermaid-code])"
      );
      mermaidElements.forEach((el) => {
        if (el.querySelector("svg")) {
          const loadingElement =
            el.parentElement?.querySelector(".mermaid-loading");
          if (loadingElement) {
            loadingElement.style.display = "none";
          }
        }
      });
    };

    // Check if Mermaid script is already loaded
    const existingScript = document.querySelector('script[src*="mermaid"]');

    const initMermaid = () => {
      // Wait a bit for ReactMarkdown to render the elements
      setTimeout(() => {
        const preparedCount = prepareMermaidDiagrams();

        if (preparedCount === 0) return; // No diagrams to render

        if (!existingScript) {
          // Load Mermaid.js if not already loaded
          const script = document.createElement("script");
          script.src =
            "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
          script.async = true;

          script.onload = () => {
            if (window.mermaid) {
              window.mermaid.initialize({
                startOnLoad: false,
                theme: "default",
                securityLevel: "loose",
                flowchart: { useMaxWidth: true, htmlLabels: true },
                fontFamily: "inherit",
              });

              // Run Mermaid after a short delay to ensure DOM is ready
              setTimeout(() => {
                const mermaidElements = document.querySelectorAll(
                  ".mermaid:not([data-mermaid-code])"
                );
                if (mermaidElements.length > 0 && window.mermaid) {
                  try {
                    // Mermaid.run() doesn't take a config object with callback in v10
                    // We'll use run() and check for completion
                    window.mermaid.run();

                    // Check periodically for rendered diagrams
                    let checkCount = 0;
                    const maxChecks = 50; // 10 seconds at 200ms intervals
                    const checkInterval = setInterval(() => {
                      checkCount++;
                      hideLoadingIndicators();
                      const allRendered = Array.from(mermaidElements).every(
                        (el) => el.querySelector("svg")
                      );
                      if (allRendered || checkCount >= maxChecks) {
                        clearInterval(checkInterval);
                        if (!allRendered) {
                          console.warn(
                            "Some Mermaid diagrams may not have rendered"
                          );
                        }
                      }
                    }, 200);
                  } catch (error) {
                    console.error("Error running Mermaid:", error);
                    hideLoadingIndicators();
                  }
                }
              }, 100);
            }
          };

          script.onerror = () => {
            console.error("Failed to load Mermaid.js");
            hideLoadingIndicators();
          };

          document.head.appendChild(script);
        } else {
          // Mermaid already loaded, initialize and run
          if (window.mermaid) {
            window.mermaid.initialize({
              startOnLoad: false,
              theme: "default",
              securityLevel: "loose",
              flowchart: { useMaxWidth: true, htmlLabels: true },
              fontFamily: "inherit",
            });

            setTimeout(() => {
              const mermaidElements = document.querySelectorAll(
                ".mermaid:not([data-mermaid-code])"
              );
              if (mermaidElements.length > 0) {
                try {
                  window.mermaid.run();

                  // Check periodically for rendered diagrams
                  let checkCount = 0;
                  const maxChecks = 50;
                  const checkInterval = setInterval(() => {
                    checkCount++;
                    hideLoadingIndicators();
                    const allRendered = Array.from(mermaidElements).every(
                      (el) => el.querySelector("svg")
                    );
                    if (allRendered || checkCount >= maxChecks) {
                      clearInterval(checkInterval);
                      if (!allRendered) {
                        console.warn(
                          "Some Mermaid diagrams may not have rendered"
                        );
                      }
                    }
                  }, 200);
                } catch (error) {
                  console.error("Error running Mermaid:", error);
                  hideLoadingIndicators();
                }
              }
            }, 100);
          }
        }
      }, 300); // Wait for ReactMarkdown to render
    };

    // Use MutationObserver to detect when markdown content is added/updated
    const markdownContainer = document.querySelector(".markdown-content");
    if (markdownContainer) {
      const observer = new MutationObserver(() => {
        // When content changes, reinitialize Mermaid
        setTimeout(() => {
          initMermaid();
        }, 500);
      });

      observer.observe(markdownContainer, {
        childList: true,
        subtree: true,
      });

      // Also initialize immediately
      initMermaid();

      return () => {
        observer.disconnect();
      };
    } else {
      // If container doesn't exist yet, wait and try again
      const checkInterval = setInterval(() => {
        const container = document.querySelector(".markdown-content");
        if (container) {
          clearInterval(checkInterval);
          initMermaid();
        }
      }, 100);

      setTimeout(() => clearInterval(checkInterval), 5000);

      return () => {
        clearInterval(checkInterval);
      };
    }
  }, [markdown]);

  const handleAsk = () => {
    if (!repo || !question.trim()) {
      return;
    }

    const params = new URLSearchParams({
      repo,
      question: question.trim(),
    });

    router.push(`/assista-wiki-ask?${params.toString()}`);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="cmpad mt-21">
          <div className="text-center py-10 md:py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-(--primary-color) mb-4"></div>
            <p className="text-lg text-slate-600">Loading documentation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="cmpad mt-21">
          <div className="text-center py-10 md:py-20">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-slate-700 mb-3">
              Error Loading Documentation
            </h3>
            <p className="text-[#7e7e7e] text-lg max-w-[700px] mx-auto mb-6">
              {error}
            </p>
            <a
              href="/assista-wiki"
              className="px-6 py-3 bg-(--primary-color) text-white rounded-full hover:bg-[#666] transition duration-300 inline-block"
            >
              Go Back
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div className="cmpad mt-21">
        <div className="wiki-container relative">
          <div className="wiki-layout">
            {/* Left Sidebar - Navigation */}
            <aside className="wiki-sidebar-left custscrollA">
              <div className="sidebar-header">
                <div className="last-indexed flex items-center gap-2">
                  {repo || "Repository"}
                  <a
                    href={`https://github.com/${repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View on GitHub"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 0 0-7.071-7.071L9.878 7.05L8.464 5.636l1.414-1.414a7 7 0 0 1 9.9 9.9zm-2.829 2.828l-1.414 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 0 0 7.07 7.071l1.415-1.414zm-.707-10.607l1.415 1.415l-7.072 7.07l-1.414-1.414z"
                      />
                    </svg>
                  </a>
                  <div ref={downloadMenuRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setDownloadMenuOpen((prev) => !prev)}
                      title="Download documentation"
                      className="flex items-center justify-center rounded-md border border-transparent bg-slate-100 p-1.5 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M16.59 9H15V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v5H7.41c-.89 0-1.34 1.08-.71 1.71l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.63-.63.19-1.71-.7-1.71M5 19c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1"
                        />
                      </svg>
                    </button>

                    {downloadMenuOpen && (
                      <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-slate-200 bg-white shadow-lg">
                        <button
                          type="button"
                          onClick={() => handleDownload("md")}
                          className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100">
                          Download Markdown (.md)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload("pdf")}
                          className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100">
                          Download PDF (.pdf)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <nav className="sidebar-nav">
                <ul className="nav-list">
                  {pages.length > 0 ? (
                    pages.map((page, index) => (
                      <li key={`page-${page.id}-${index}`} className="nav-item">
                        <button
                          onClick={() => {
                            setActivePageId(page.id);
                            setShowDiagramsView(false);
                          }}
                          className={`nav-link w-full text-left ${
                            activePageId === page.id ? "nav-link-main" : ""
                          }`}
                        >
                          {page.title}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="nav-item">
                      <span className="nav-link text-slate-400 italic">
                        No pages found
                      </span>
                    </li>
                  )}
                </ul>
              </nav>
            </aside>

            {/* Main Content Area */}
            <main className="wiki-main-content custscrollA mb-10">
              {showDiagramsView ? (
                <DiagramsView
                  pages={pages}
                  activePageId={activePageId}
                  onClose={() => setShowDiagramsView(false)}
                />
              ) : pages.length > 0 ? (
                (() => {
                  const activePage =
                    pages.find((p) => p.id === activePageId) || pages[0];
                  const currentIndex = pages.findIndex(
                    (p) => p.id === activePageId
                  );
                  const hasPrev = currentIndex > 0;
                  const hasNext = currentIndex < pages.length - 1;

                  return (
                    <>
                      <div className="markdown-content">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                          components={components}
                        >
                          {sanitizeMarkdown(activePage.content)}
                        </ReactMarkdown>
                      </div>

                      {(hasPrev || hasNext) && (
                        <div className="mt-8 mb-20 flex justify-between items-center gap-4 pt-6 border-t border-gray-200">
                          {hasPrev ? (
                            <button
                              onClick={() => {
                                setActivePageId(pages[currentIndex - 1].id);
                                setShowDiagramsView(false);
                                // Scroll to top of the content area
                                const contentContainer =
                                  document.querySelector(".wiki-main-content");
                                if (contentContainer) {
                                  contentContainer.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  });
                                } else {
                                  window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  });
                                }
                              }}
                              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.42Z"
                                />
                              </svg>
                              <span className="font-medium">
                                {pages[currentIndex - 1].title}
                              </span>
                            </button>
                          ) : (
                            <div></div>
                          )}
                          {hasNext && (
                            <button
                              onClick={() => {
                                setActivePageId(pages[currentIndex + 1].id);
                                setShowDiagramsView(false);
                                // Scroll to top of the content area
                                const contentContainer =
                                  document.querySelector(".wiki-main-content");
                                if (contentContainer) {
                                  contentContainer.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  });
                                } else {
                                  window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  });
                                }
                              }}
                              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                            >
                              <span className="font-medium">
                                {pages[currentIndex + 1].title}
                              </span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6-6 6-1.41-1.42Z"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()
              ) : (
                <div className="content-header" id="overview">
                  <h1 className="main-title">No documentation available</h1>
                  <p className="section-text">
                    Please generate documentation first.
                  </p>
                </div>
              )}

              <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[600px] z-40">
                <div className="flex gap-3 bg-white py-4 ps-6 pe-4 border border-[#d1d1d1] rounded-full [box-shadow:0px_0px_20px_#00000014] w-full max-w-[750px]">
                  <input
                    type="text"
                    placeholder={`Ask wiki about ${repo}`}
                    className="w-full focus:outline-none bg-transparent"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAsk();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="cursor-pointer shrink-0"
                    onClick={handleAsk}
                    disabled={!question.trim()}
                    aria-label="Ask documentation assistant"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M12 1.25c5.937 0 10.75 4.813 10.75 10.75S17.937 22.75 12 22.75S1.25 17.937 1.25 12S6.063 1.25 12 1.25m-.47 6.72a.75.75 0 1 0-1.06 1.06L13.44 12l-2.97 2.97a.75.75 0 1 0 1.06 1.06l3.5-3.5a.75.75 0 0 0 0-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </main>

            {/* Right Sidebar - On This Page */}
            <aside className="wiki-sidebar-right custscrollA">
              <div className="sidebar-header">
                <h3 className="sidebar-title">On this page</h3>
              </div>
              <nav className="page-nav">
                <ul className="page-nav-list">
                  {sections.filter((s) => s.pageId === activePageId).length >
                  0 ? (
                    sections
                      .filter((s) => s.pageId === activePageId)
                      .map((section, index) => (
                        <li key={`page-nav-${section.id}-${index}`}>
                          <a
                            href={`#${section.id}`}
                            className={`page-nav-link ${
                              activeSection === section.id ? "active" : ""
                            }`}
                          >
                            {section.title}
                          </a>
                        </li>
                      ))
                  ) : (
                    <li>
                      <span className="page-nav-link text-slate-400">
                        No headings available
                      </span>
                    </li>
                  )}
                </ul>
              </nav>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

// Diagrams View Component
function DiagramsView({ pages, activePageId, onClose }) {
  const [pageDiagrams, setPageDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to download diagram as SVG or PNG
  const downloadDiagram = async (diagramId, diagramTitle, format = "svg") => {
    const diagramElement = document.querySelector(
      `#diagram-${diagramId} .mermaid svg`
    );
    if (!diagramElement) {
      console.error(
        "Diagram SVG not found. Make sure the diagram is fully rendered."
      );
      alert("Diagram is still loading. Please wait a moment and try again.");
      return;
    }

    const svg = diagramElement.cloneNode(true);

    // Get SVG dimensions - try multiple methods to handle different SVG configurations
    let width, height;

    try {
      const bbox = svg.getBBox();
      width = bbox.width || 1200;
      height = bbox.height || 800;
    } catch (e) {
      // If getBBox fails, try to get from attributes or computed style
      const viewBox = svg.getAttribute("viewBox");
      if (viewBox) {
        const parts = viewBox.split(/\s+/);
        if (parts.length >= 4) {
          width = parseFloat(parts[2]) || 1200;
          height = parseFloat(parts[3]) || 800;
        }
      }

      // Try to get from width/height attributes
      if (!width) {
        const widthAttr = svg.getAttribute("width");
        const heightAttr = svg.getAttribute("height");
        width = widthAttr ? parseFloat(widthAttr) : 1200;
        height = heightAttr ? parseFloat(heightAttr) : 800;
      }

      // Fallback to computed style
      if (!width || width === 1200) {
        const computedStyle = window.getComputedStyle(svg);
        width =
          parseFloat(computedStyle.width) ||
          parseFloat(svg.clientWidth) ||
          1200;
        height =
          parseFloat(computedStyle.height) ||
          parseFloat(svg.clientHeight) ||
          800;
      }
    }

    // Ensure we have valid dimensions
    width = width || 1200;
    height = height || 800;

    // Ensure SVG has proper dimensions
    svg.setAttribute("width", width.toString());
    svg.setAttribute("height", height.toString());

    // Set viewBox if not already set
    if (!svg.getAttribute("viewBox")) {
      try {
        const bbox = svg.getBBox();
        svg.setAttribute(
          "viewBox",
          `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`
        );
      } catch (e) {
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      }
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const filename = `${diagramTitle
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()}.${format}`;

    if (format === "svg") {
      const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === "png") {
      // Convert SVG to PNG using a safer method
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      // Set canvas dimensions
      const scale = 2; // For better quality
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);

      // Convert SVG to data URL to avoid CORS issues
      // First, ensure SVG has proper namespace and encoding
      let svgDataUrl = "data:image/svg+xml;charset=utf-8,";

      // Encode SVG for data URL (encode special characters)
      const encodedSvg = encodeURIComponent(svgData);
      svgDataUrl += encodedSvg;

      // Set crossOrigin to anonymous to prevent tainting
      img.crossOrigin = "anonymous";

      img.onload = () => {
        try {
          ctx.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            if (!blob) {
              console.error("Failed to convert to PNG");
              alert(
                "Error converting diagram to PNG. Please try downloading as SVG instead."
              );
              return;
            }

            const pngUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = pngUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(pngUrl);
          }, "image/png");
        } catch (error) {
          console.error("Error drawing image to canvas:", error);
          alert(
            "Error converting diagram to PNG. The diagram may contain external resources. Please try downloading as SVG instead."
          );
        }
      };

      img.onerror = (error) => {
        console.error("Error loading SVG image:", error);
        alert(
          "Error converting diagram to PNG. Please try downloading as SVG instead."
        );
      };

      img.src = svgDataUrl;
    }
  };

  // Extract Mermaid diagrams from pages
  useEffect(() => {
    const extractDiagrams = () => {
      const diagrams = [];
      pages.forEach((page) => {
        const lines = page.content.split("\n");
        let inCodeBlock = false;
        let currentDiagram = null;
        let diagramLines = [];
        let recentHeader = "Diagram";

        lines.forEach((line, idx) => {
          // Check for headers before diagram
          const headerMatch = line.match(/^#{2,4}\s+(.+)$/);
          if (headerMatch && !inCodeBlock) {
            recentHeader = headerMatch[1].trim();
          }

          const codeBlockMatch = line.match(/^```(\w+)?/);
          if (codeBlockMatch) {
            if (codeBlockMatch[1] === "mermaid") {
              inCodeBlock = true;
              currentDiagram = {
                pageId: page.id,
                pageTitle: page.title,
                title: recentHeader,
                content: [],
              };
              return;
            } else {
              inCodeBlock = false;
              if (currentDiagram) {
                currentDiagram.content = diagramLines.join("\n");
                diagrams.push(currentDiagram);
                currentDiagram = null;
                diagramLines = [];
              }
            }
          }

          if (inCodeBlock && currentDiagram) {
            diagramLines.push(line);
          }
        });

        if (currentDiagram && diagramLines.length > 0) {
          currentDiagram.content = diagramLines.join("\n");
          diagrams.push(currentDiagram);
        }
      });
      setPageDiagrams(diagrams);
      setLoading(false);
    };

    extractDiagrams();
  }, [pages]);

  // Initialize Mermaid for diagrams
  useEffect(() => {
    if (pageDiagrams.length === 0) {
      setLoading(false);
      return;
    }

    const loadMermaidScript = () => {
      return new Promise((resolve, reject) => {
        const existingScript = document.querySelector('script[src*="mermaid"]');
        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initializeMermaid = async () => {
      try {
        await loadMermaidScript();

        if (!window.mermaid) {
          console.error("Mermaid.js not available");
          return;
        }

        window.mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          flowchart: { useMaxWidth: true, htmlLabels: true },
          fontFamily: "inherit",
        });

        // Wait for diagrams to render
        setTimeout(() => {
          const diagrams = document.querySelectorAll(".mermaid-diagram");
          if (diagrams.length > 0 && window.mermaid) {
            try {
              window.mermaid.run();
            } catch (error) {
              console.error("Error running Mermaid:", error);
            }
          }
        }, 300);
      } catch (error) {
        console.error("Error initializing Mermaid:", error);
      }
    };

    initializeMermaid();
  }, [pageDiagrams, activePageId]);

  const diagramsInCurrentPage = pageDiagrams.filter(
    (d) => d.pageId === activePageId
  );

  return (
    <div className="diagrams-view">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Diagrams & Graphs</h2>
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          Back to Content
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 md:py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-(--primary-color) mb-4"></div>
          <p className="text-lg text-slate-600">Loading diagrams...</p>
        </div>
      ) : diagramsInCurrentPage.length === 0 ? (
        <div className="text-center py-10 md:py-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            className="mx-auto mb-4 text-gray-400"
          >
            <path
              fill="currentColor"
              d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12c0 1.11-.89 2-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m0 10v2h8v-2H6Z"
            />
          </svg>
          <p className="text-lg text-slate-600">
            No diagrams found for this page
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {diagramsInCurrentPage.map((diagram, idx) => {
            const diagramId = `${activePageId}-${idx}`;
            return (
              <div
                key={`curr-${idx}`}
                id={`diagram-${diagramId}`}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {diagram.title}
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        downloadDiagram(diagramId, diagram.title, "svg")
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                      title="Download as SVG"
                    >
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
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      <span>SVG</span>
                    </button>
                    <button
                      onClick={() =>
                        downloadDiagram(diagramId, diagram.title, "png")
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                      title="Download as PNG"
                    >
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
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      <span>PNG</span>
                    </button>
                  </div>
                </div>
                <div className="mermaid mermaid-diagram bg-gray-50 p-4 rounded">
                  {diagram.content}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default page;
