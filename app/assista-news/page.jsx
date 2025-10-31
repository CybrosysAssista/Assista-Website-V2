"use client";
import React, { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Image from "next/image";

function Page() {
  const sampleNews = [
    {
      id: 1,
      category: "Technology",
      title: "The Future of Artificial Intelligence in Healthcare",
      excerpt:
        "Exploring how AI is revolutionizing medical diagnostics and patient care across the globe.",
      author: "Sarah Johnson",
      date: "2025-10-22",
      readTime: "5 min",
      image:
        "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: true,
    },
    {
      id: 2,
      category: "Business",
      title: "Startup Ecosystems Thrive in Emerging Markets",
      excerpt:
        "A deep dive into how developing nations are becoming innovation hubs.",
      author: "Michael Chen",
      date: "2025-10-21",
      readTime: "4 min",
      image:
        "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      id: 3,
      category: "Environment",
      title: "Climate Solutions Through Renewable Energy Innovation",
      excerpt:
        "New breakthroughs in solar and wind technology promise a sustainable future.",
      author: "Emma Rodriguez",
      date: "2025-10-20",
      readTime: "6 min",
      image:
        "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      id: 4,
      category: "Culture",
      title: "The Renaissance of Independent Cinema",
      excerpt:
        "How streaming platforms are empowering diverse storytellers worldwide.",
      author: "James Walker",
      date: "2025-10-19",
      readTime: "7 min",
      image:
        "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      id: 5,
      category: "Science",
      title: "Quantum Computing Reaches New Milestone",
      excerpt: "Researchers achieve breakthrough in quantum error correction.",
      author: "Dr. Lisa Park",
      date: "2025-10-18",
      readTime: "5 min",
      image:
        "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      id: 6,
      category: "Sports",
      title:
        "Athletes Embrace Mental Health Advocacy Athletes Embrace Mental Health Advocacy",
      excerpt:
        "Professional sports see a cultural shift toward wellness and balance.",
      author: "Marcus Thompson",
      date: "2025-10-17",
      readTime: "4 min",
      image:
        "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ];

  const [showCategory, setShowCategory] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const catRef = useRef(null);
  const filterRef = useRef(null);

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

  const [searchTerm, setSearchTerm] = useState("");

  // Filter the news list based on search input
  const filteredNews = sampleNews.filter(
    (news) =>
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Header />
      <div className="cmpad pt-30 slider inslider nslider">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
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
              <br /> Communicate
              <span className="brush brushn">intelligently.</span>
            </h1>
            <p className="max-w-[600px] leading-7 text-[#7e7e7e]">
              Assista Air brings natural, AI-driven conversations to your
              workflow. From smart responses to task automation and get things
              done faster with ease.
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

      <div className="cmpad py-20">
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Category dropdown */}
          <div ref={catRef} className="relative">
            <button
              onClick={() => setShowCategory((v) => !v)}
              className="cursor-pointer px-6 py-4 rounded-full bg-[var(--primary-color)] hover:bg-[#666] transition duration-300 text-white text-sm flex items-center gap-2"
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
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg p-2 z-50">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setShowCategory(false);
                  }}
                  className="cursor-pointer block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded"
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setSearchTerm("technology");
                    setShowCategory(false);
                  }}
                  className="cursor-pointer block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded"
                >
                  Technology
                </button>
                <button
                  onClick={() => {
                    setSearchTerm("business");
                    setShowCategory(false);
                  }}
                  className="cursor-pointer block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded"
                >
                  Business
                </button>
                <button
                  onClick={() => {
                    setSearchTerm("science");
                    setShowCategory(false);
                  }}
                  className="cursor-pointer block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded"
                >
                  Science
                </button>
                <button
                  onClick={() => {
                    setSearchTerm("culture");
                    setShowCategory(false);
                  }}
                  className="cursor-pointer block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded"
                >
                  Culture
                </button>
              </div>
            )}
          </div>

          {/* Filter dropdown */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => setShowFilter((v) => !v)}
              className="cursor-pointer px-6 py-4 rounded-full bg-[var(--primary-color)] hover:bg-[#666] transition duration-300 text-white text-sm flex items-center gap-2"
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
                  onClick={() => {
                    /* example: newest first */ setShowFilter(false);
                  }}
                  className="cursor-pointer block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded"
                >
                  Newest
                </button>
                <button
                  onClick={() => {
                    /* example: featured */ setSearchTerm("featured");
                    setShowFilter(false);
                  }}
                  className="cursor-pointer block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded"
                >
                  Featured
                </button>
                <button
                  onClick={() => {
                    /* example: most read */ setShowFilter(false);
                  }}
                  className="cursor-pointer block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded"
                >
                  Most read
                </button>
              </div>
            )}
          </div>
        </nav>

        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {filteredNews.map((news) => (
              <article
                key={news.id}
                className="cursor-pointer lg:col-span-4 group bg-white rounded-md [box-shadow:0px_0px_20px_#00000014] hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <span className="absolute top-4 left-4 article-category">
                    {news.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"
                        />
                      </svg>
                      <span>{news.author}</span>
                    </div>
                    <span className="text-slate-400">•</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12 20a8 8 0 0 0 8-8a8 8 0 0 0-8-8a8 8 0 0 0-8 8a8 8 0 0 0 8 8m0-18a10 10 0 0 1 10 10a10 10 0 0 1-10 10C6.47 22 2 17.5 2 12A10 10 0 0 1 12 2m.5 5v5.25l4.5 2.67l-.75 1.23L11 13V7h1.5Z"
                        />
                      </svg>
                      <span>{news.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-3 leading-snug line-clamp-2">
                    {news.title}
                  </h3>

                  <p className="text-[#7e7e7e] text-md mb-4 leading-relaxed line-clamp-3 flex-grow">
                    {news.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm text-slate-500">
                      {formatDate(news.date)}
                    </span>
                    <a
                      href=""
                      className="inline-flex items-center gap-1.5 text-[#e97d82] text-md font-medium hover:text-[#aa6e71] transition-all"
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
      </div>

      <Footer />
    </div>
  );
}

export default Page;
