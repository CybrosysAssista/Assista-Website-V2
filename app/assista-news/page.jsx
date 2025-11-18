"use client";
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Image from "next/image";

// API base URL - adjust this to match your server configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const buildClientUrl = (path) => {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  if (API_BASE_URL) {
    const base = API_BASE_URL.endsWith("/")
      ? API_BASE_URL.slice(0, -1)
      : API_BASE_URL;
    return `${base}${path}`;
  }
  return path;
};

const DEFAULT_CATEGORIES = ["General", "Technology", "Business", "Science", "Culture"];

function Page() {
  const [showCategory, setShowCategory] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortFilter, setSortFilter] = useState("newest"); // newest, featured, most_read
  const catRef = useRef(null);
  const filterRef = useRef(null);
  const newsSectionRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const searchTimeoutRef = useRef(null);

  // Helper function to calculate read time
  const calculateReadTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
  };

  const categoriesQuery = useQuery({
    queryKey: ["newsCategories"],
    queryFn: async () => {
      const response = await fetch(buildClientUrl("/api/news/categories"));
      if (!response.ok) {
        throw new Error(`Failed to fetch categories (status ${response.status})`);
      }
      const payload = await response.json();
      if (Array.isArray(payload?.categories)) {
        return payload.categories;
      }
      if (Array.isArray(payload)) {
        return payload;
      }
      return [];
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  const newsQuery = useQuery({
    queryKey: [
      "newsFeed",
      {
        page: currentPage,
        pageSize,
        search: searchQuery.trim(),
        category: selectedCategory,
        sort: sortFilter,
      },
    ],
    queryFn: async ({ queryKey, signal }) => {
      const [, params] = queryKey;
      const searchParams = new URLSearchParams();
      searchParams.set("page", params.page.toString());
      searchParams.set("page_size", params.pageSize.toString());
      if (params.search) {
        searchParams.set("q", params.search);
      }
      if (params.category) {
        searchParams.set("category", params.category);
      }

      const response = await fetch(
        buildClientUrl(`/api/news?${searchParams.toString()}`),
        { signal }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Too many requests. Please wait a moment and try again.");
        }
        const message = await response.text();
        throw new Error(message || `Failed to fetch news (status ${response.status})`);
      }

      const data = await response.json();
      const rawArticles = data.articles || data.data || [];

      const mappedNews = rawArticles.map((article, index) => {
        const excerpt = article.summary || article.description || "";
        const readTime = calculateReadTime(excerpt);
        const readTimeMinutes = parseInt(readTime, 10) || 1;

        return {
          id: article.id || article.link || `article-${index}`,
          category: article.category || "General",
          title: article.title || "No Title",
          excerpt,
          author: article.source || "Unknown",
          date: article.published || new Date().toISOString(),
          readTime: calculateReadTime(
            article.summary || article.description || ""
          ),
          image: article.image_url || "/img/news-thumb.jpg",
          featured: article.featured || false,
          link: article.link || "",
        };
      });

      let sortedNews = mappedNews;
      if (params.sort === "newest") {
        sortedNews = [...mappedNews].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      } else if (params.sort === "featured") {
        sortedNews = [...mappedNews].sort(
          (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        );
      } else if (params.sort === "most_read") {
        sortedNews = [...mappedNews].sort(
          (a, b) => a.readTimeMinutes - b.readTimeMinutes
        );
      }

      const total =
        typeof payload.total === "number"
          ? payload.total
          : typeof payload.count === "number"
            ? payload.count
            : sortedNews.length;

      const page =
        typeof payload.page === "number" ? payload.page : params.page;

      const totalPages =
        typeof payload.total_pages === "number"
          ? payload.total_pages
          : total
            ? Math.max(1, Math.ceil(total / params.pageSize))
            : Math.max(1, page);

      return {
        items: sortedNews,
        total,
        page,
        totalPages,
        generatedAt: payload.generated_at ?? payload.generatedAt ?? null,
      };
    },
    keepPreviousData: true,
    staleTime: 30_000,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("Too many requests")) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const categories = categoriesQuery.data?.length
    ? categoriesQuery.data
    : DEFAULT_CATEGORIES;
  const isCategoriesLoading = categoriesQuery.isLoading;

  const newsItems = newsQuery.data?.items ?? [];
  const totalPages = newsQuery.data?.totalPages ?? 1;
  const totalItems = newsQuery.data?.total ?? newsItems.length;
  const displayedPage = newsQuery.data?.page ?? currentPage;
  const isNewsLoading = newsQuery.isLoading;
  const isNewsFetching = newsQuery.isFetching;
  const isRefetching = isNewsFetching && !isNewsLoading;
  const newsErrorMessage =
    newsQuery.error instanceof Error
      ? newsQuery.error.message
      : newsQuery.error
      ? "Failed to fetch news. Please try again later."
      : null;

  useEffect(() => {
    if (
      newsQuery.data?.page !== undefined &&
      newsQuery.data.page !== currentPage
    ) {
      setCurrentPage(newsQuery.data.page);
    }
  }, [newsQuery.data?.page, currentPage]);

  useEffect(() => {
    function onDoc(e) {
      if (catRef.current && !catRef.current.contains(e.target))
        setShowCategory(false);
      if (filterRef.current && !filterRef.current.contains(e.target))
        setShowFilter(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, selectedCategory, sortFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchChange = (value) => {
    setSearchInput(value);
    // Increased debounce to reduce API calls (1500ms = 1.5 seconds)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 1500); // 1.5 second debounce to prevent rate limiting
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      if (newsSectionRef.current) {
        newsSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  // Category handlers
  const handleCategorySelect = (category) => {
    setSelectedCategory(category === "All" ? "" : category);
    setShowCategory(false);
  };

  // Filter handlers
  const handleFilterSelect = (filter) => {
    if (filter === "newest") {
      setSortFilter("newest");
    } else if (filter === "featured") {
      setSortFilter("featured");
    } else if (filter === "most_read") {
      setSortFilter("most_read");
    }
    setShowFilter(false);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;
    const activePage = displayedPage;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (activePage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, activePage - 1);
      const end = Math.min(totalPages - 1, activePage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (activePage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div>
      <Header />
      <div className="cmpad pt-30 slider inslider nslider">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-10 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/img/assista-news.svg"
                alt=""
                width={50}
                height={50}
              />
              <span className="font-semibold text-4xl text-[#818181]">
                Assista News
              </span>
            </div>

            <h1 className="text-5xl font-medium mb-3 leading-15">
              Your assistant to
              <br className="hidden lg:block" />  Communicate
              <span className="brush brushn">intelligently.</span>
            </h1>
            <p className="max-w-[600px] leading-7 text-[#7e7e7e]">
              Assista Air brings natural, AI-driven conversations to your
              workflow. From smart responses to task automation and get things
              done faster with ease.
            </p>

            <div className="flex gap-2 mt-10 mb-3 md:mb-15">
              <a
                href=""
              className="flex justify-center items-center w-45 py-3 bg-(--primary-color) text-white rounded-full hover:bg-[#666] transition duration-300"
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

      <div ref={newsSectionRef} className="cmpad py-20">
        <div style={{ textAlign: "center" }}>
          <span className="badge">Assista News</span>
        </div>

        <h2 className="mainhead relative w-max m-auto">
          Stay updated with the{"  "}
          <span className="underlineimg underlinen"> latest AI News</span>
        </h2>

        <p className="leading-7 text-[#7e7e7e] text-center max-w-[750px] mx-auto mb-15 text-lg">
          Discover how Assista is transforming industries with cutting edge AI
          innovations. From product updates to industry insights shaping the way
          we work.
        </p>

        <nav className="relative bg-white flex items-center gap-3 justify-center [box-shadow:0px_0px_20px_#00000014] p-3 rounded-full w-max mx-auto mb-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
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
            className="border border-[#e9e9e9] focus:border-[#949494] focus:outline-none transition duration-300 rounded-full p-3 ps-13 px-5 w-[200px] md:w-[400px] lg:w-[600px]"
            placeholder="Search Here..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          {/* Category dropdown */}
          <div ref={catRef} className="relative">
            <button
              onClick={() => setShowCategory((v) => !v)}
              className="cursor-pointer px-6 py-4 rounded-full bg-(--primary-color) hover:bg-[#666] transition duration-300 text-white text-sm flex items-center gap-2"
              aria-expanded={showCategory}
            >
              Category
              <span className="text-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M7 9a1 1 0 0 0-.707 1.707l5 5a1 1 0 0 0 1.414 0l5-5A1 1 0 0 0 17 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </button>

            {showCategory && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg p-2 z-50 max-h-96 overflow-y-auto">
                <button
                  onClick={() => handleCategorySelect("All")}
                  className={`cursor-pointer block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded ${
                    selectedCategory === "" ? "bg-slate-100 font-semibold" : ""
                  }`}
                >
                  All Categories
                </button>
                {isCategoriesLoading ? (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Loading categories...
                  </div>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`cursor-pointer block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded ${
                        selectedCategory === category
                          ? "bg-slate-100 font-semibold"
                          : ""
                      }`}
                    >
                      {category}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No categories available.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Filter dropdown */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => setShowFilter((v) => !v)}
              className="cursor-pointer px-6 py-4 rounded-full bg-(--primary-color) hover:bg-[#666] transition duration-300 text-white text-sm flex items-center gap-2"
              aria-expanded={showFilter}
            >
              Filter
              <span className="text-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M7 9a1 1 0 0 0-.707 1.707l5 5a1 1 0 0 0 1.414 0l5-5A1 1 0 0 0 17 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </button>

            {showFilter && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg p-2 z-50">
                <button
                  onClick={() => handleFilterSelect("newest")}
                  className={`cursor-pointer block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded ${
                    sortFilter === "newest"
                      ? "bg-slate-100 font-semibold"
                      : ""
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => handleFilterSelect("featured")}
                  className={`cursor-pointer block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded ${
                    sortFilter === "featured"
                      ? "bg-slate-100 font-semibold"
                      : ""
                  }`}
                >
                  Featured
                </button>
                <button
                  onClick={() => handleFilterSelect("most_read")}
                  className={`cursor-pointer block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded ${
                    sortFilter === "most_read"
                      ? "bg-slate-100 font-semibold"
                      : ""
                  }`}
                >
                  Most read
                </button>
              </div>
            )}
          </div>
        </nav>

        {isRefetching && !isNewsLoading && (
          <div className="text-center pb-4 text-sm text-slate-500">
            Updating results…
          </div>
        )}

        {isNewsLoading ? (
          <div className="text-center py-10 md:py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-(--primary-color) mb-4"></div>
            <p className="text-lg text-slate-600">Loading news articles...</p>
          </div>
        ) : newsErrorMessage ? (
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
              Error Loading News
            </h3>
            <p className="text-[#7e7e7e] text-lg max-w-[700px] mx-auto mb-6">
              {newsErrorMessage}
            </p>
            <button
              onClick={() => newsQuery.refetch()}
              className="px-6 py-3 bg-(--primary-color) text-white rounded-full hover:bg-[#666] transition duration-300"
            >
              Retry
            </button>
          </div>
        ) : newsItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {newsItems.map((newsItem) => (
              <article
                key={newsItem.id}
                className="cursor-pointer lg:col-span-4 group bg-white rounded-md [box-shadow:0px_0px_20px_#00000014] hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col"
                onClick={() =>
                  newsItem.link &&
                  window.open(newsItem.link, "_blank", "noopener,noreferrer")
                }
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={newsItem.image}
                    alt={newsItem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent"></div>
                  <span className="absolute top-4 left-4 article-category">
                    {newsItem.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col grow">
                  <div className="flex items-center gap-3 text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"
                        />
                      </svg>
                      <span>{newsItem.author}</span>
                    </div>
                    <span className="text-slate-400">•</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12 20a8 8 0 0 0 8-8a8 8 0 0 0-8-8a8 8 0 0 0-8 8a8 8 0 0 0 8 8m0-18a10 10 0 0 1 10 10a10 10 0 0 1-10 10C6.47 22 2 17.5 2 12A10 10 0 0 1 12 2m.5 5v5.25l4.5 2.67l-.75 1.23L11 13V7h1.5Z"
                        />
                      </svg>
                      <span>{newsItem.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-3 leading-snug line-clamp-2">
                    {newsItem.title}
                  </h3>

                  <p className="text-[#7e7e7e] text-md mb-4 leading-relaxed line-clamp-3 grow">
                    {newsItem.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm text-slate-500">
                      {formatDate(newsItem.date)}
                    </span>
                    <a
                      href={newsItem.link || "#"}
                      target={newsItem.link ? "_blank" : undefined}
                      rel={newsItem.link ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 text-[#e97d82] text-md font-medium hover:text-[#aa6e71] transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Read More
                    </a>
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
                No News Articles Found
              </h3>
              <p className="text-[#7e7e7e] text-lg max-w-[700px] mx-auto leading-relaxed">
                We couldn’t find any results for your search. Try adjusting your
                keywords or browse our latest updates to discover what’s new
                with Assista.
              </p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isNewsLoading && !newsErrorMessage && totalPages > 1 && (
          <div className="flex flex-col items-center justify-center mt-20 mb-10">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(displayedPage - 1)}
                disabled={displayedPage === 1}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                  displayedPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-(--primary-color) text-white hover:bg-[#666]"
                }`}
                aria-label="Previous page"
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
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span>Previous</span>
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((page, index) => (
                <React.Fragment key={`page-${page}-${index}`}>
                  {page === "..." ? (
                    <span className="px-4 py-2 text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 min-w-[40px] ${
                        displayedPage === page
                          ? "bg-(--primary-color) text-white font-semibold"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                      }`}
                      aria-label={`Go to page ${page}`}
                      aria-current={displayedPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(displayedPage + 1)}
                disabled={displayedPage === totalPages}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                  displayedPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-(--primary-color) text-white hover:bg-[#666]"
                }`}
                aria-label="Next page"
              >
                <span>Next</span>
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
              </button>
            </div>

            {/* Page Info */}
            <div className="mt-6 text-sm text-slate-600">
              Showing page {displayedPage} of {totalPages} ({totalItems} total
              articles)
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Page;
