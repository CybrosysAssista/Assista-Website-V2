"use client";
import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Image from "next/image";

function Page() {
  const sampleNews = [
    {
      id: 1,
      title: "microsoft/vscode",
      excerpt: "Visual Studio Code",
      rating: "43k",
    },
    {
      id: 2,
      title: "mark3labs/mcp-go",
      excerpt:
        "A Go implementation of the Model Context Protocol (MCP), enabling seamless integration between LLM aaaaaaaaaaaaaa aa",
      rating: "20k",
    },
    {
      id: 3,
      title: "antiwork/gumroad",
      excerpt: "Fully local web research and report writing assistant",
      rating: "20k",
    },
    {
      id: 4,
      title: "meta-llama/llama-models",
      excerpt: "Utilities intended for use with Llama models.",
      rating: "20k",
    },
    {
      id: 5,
      title: "huggingface/transformers",
      excerpt:
        "Transformers: State-of-the-art Machine Learning for Pytorch, TensorFlow, and JAX.",
      rating: "20k",
    },
    {
      id: 6,
      title: "langchain-ai/langchain",
      excerpt: "Build context-aware reasoning applications",
      rating: "20k",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  // Filter the news list based on search input
  const filteredNews = sampleNews.filter((news) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      news.title.toLowerCase().includes(term) ||
      news.excerpt.toLowerCase().includes(term) ||
      news.rating.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <Header />
      <div className="cmpad pt-30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Image src="/img/logo7.svg" alt="" width={60} height={60} />
              <span className="font-semibold text-4xl text-[#818181]">
                Assista wiki
              </span>
            </div>

            <h1 className="text-5xl font-medium mb-3 leading-15">
              Your assistant to
              <br /> Organize{" "}
              <span className="bg-gradient-to-r from-[#e97d83] to-[#e19bff] bg-clip-text text-transparent relative">
                knowledge.
              </span>
            </h1>
            <p className="max-w-[600px] leading-7 text-[#7e7e7e]">
              Assista Wiki helps you create, manage, and access knowledge
              effortlessly. From documentation to team guides and always within
              reach.
            </p>

            <div className="flex gap-2 mt-10 mb-15">
              <a
                href=""
                className="flex justify-center items-center w-45 py-3 bg-[var(--primary-color)] text-white rounded-md hover:bg-[#ce797e] transition duration-300"
              >
                Get Started
              </a>
              <a
                href=""
                className="text-center w-45 py-3 text-[#ee767c] bg-[#e97d8228] border-[#e97d8225] border-2 rounded-md hover:bg-[#ce797e] hover:border-[#ce797e] hover:text-white transition duration-300"
              >
                Read More
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
          <span className="badge">Assista Wiki</span>
        </div>

        <h2 className="mainhead relative w-max m-auto">
          Learn more with{" "}
          <span className="bg-gradient-to-r from-[#e97d83] to-[#e19bff] bg-clip-text text-transparent relative">
            depth AI knowledge
          </span>
        </h2>

        <p className="leading-7 text-[#7e7e7e] text-center max-w-[700px] mx-auto mb-15">
          Explore the Assista Wiki your go-to resource for understanding
          automation and productivity practical insights guides to help you
          master.
        </p>

        <nav className="relative bg-white flex flex-wrap gap-3 justify-center [box-shadow:0px_0px_20px_#00000014] p-3 rounded-full w-max mx-auto mb-20">
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
            className="border border-[#e9e9e9] focus:border-[#e97d83] focus:outline-none transition duration-300 rounded-full p-3 ps-13 px-5 w-[800px]"
            placeholder="Search Here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </nav>

        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {filteredNews.map((news) => (
              <article
                key={news.id}
                className="cursor-pointer lg:col-span-4 group bg-white rounded-md [box-shadow:0px_0px_20px_#00000014] hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col"
              >
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-medium text-slate-900 mb-3 leading-snug line-clamp-2">
                    {news.title}
                  </h3>

                  <p className="text-[#7e7e7e] text-sm mb-4 leading-relaxed line-clamp-2 flex-grow ">
                    {news.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="text-[#f3d32b]"
                      >
                        <path
                          fill="currentColor"
                          d="m12 16.102l-3.63 2.192q-.16.079-.297.064q-.136-.016-.265-.094q-.13-.08-.196-.226t-.012-.319l.966-4.11l-3.195-2.77q-.135-.11-.178-.263t.019-.293t.165-.23q.104-.087.28-.118l4.216-.368l1.644-3.892q.068-.165.196-.238T12 5.364t.288.073t.195.238l1.644 3.892l4.215.368q.177.03.281.119q.104.088.166.229q.061.14.018.293t-.178.263l-3.195 2.77l.966 4.11q.056.171-.011.318t-.197.226q-.128.08-.265.095q-.136.015-.296-.064z"
                        />
                      </svg>
                      {news.rating}
                    </span>
                    <a
                      href="/assista-wiki-details"
                      className="inline-flex items-center gap-1.5 text-[#e97d82] text-md font-medium hover:text-[#aa6e71] transition-all"
                    >
                      Click Here
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
