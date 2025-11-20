"use client";
import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Image from "next/image";

function Page() {
  const tabs = [
    { id: "ide-docs", label: "IDE Docs" },
    { id: "create", label: "Create" },
    { id: "collaborate", label: "Collaborate" },
    { id: "security", label: "Security" },
    { id: "customers", label: "Customers" },
    { id: "faq", label: "FAQ" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // animated cycling placeholder for the textarea
  const placeholders = [
    "Automate invoice processing",
    "Customer onboarding flow",
    "Generate scheduled reports",
    "Sync product catalog & inventory",
    "Conditional overdue invoice actions",
    "Multi step hiring workflow",
    "Cross team handoff automation",
    "Auto import & reconcile bank statements",
    "Marketing funnel automation",
    "Provision customer environments",
  ];
  const [phIndex, setPhIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // quick "flip" out, change text, flip in
      setIsFlipping(true);
      setTimeout(() => {
        setPhIndex((i) => (i + 1) % placeholders.length);
        setIsFlipping(false);
      }, 350);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observedSections = tabs
      .map((t) => document.getElementById(t.id))
      .filter(Boolean);

    if (observedSections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // choose the most visible section (largest intersectionRatio)
        let visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveTab(visible.target.id);
        }
      },
      {
        root: null,
        rootMargin: "-35% 0px -45% 0px", // tweak to match sticky nav height
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    observedSections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <Header />
      <div className="bg-[url('/img/bgbuilder.svg')] bg-cover bg-center bg-no-repeat pt-15">
        <div className="cmpad pt-20 lg:pt-40 pb-30 inslider">
          <div className="backdrop-blur-sm lg:backdrop-blur-3xl p-5 md:p-13  rounded-xl bg-[#ffffff8a] border border-gray-200">
            <div className="flex gap-2 justify-between flex-row-reverse items-center mb-10">
              <div className="">
                <img src="/img/assista-builder.svg" alt="" width={80} />
              </div>
              <div>
                <h1 className="text-3xl mb-2 font-semibold bg-gradient-to-r from-[#11ccf1] to-[#04a4ef] bg-clip-text text-transparent inline-block">
                  Hello, Designer
                </h1>
                <h2 className="text-2xl text-[#666] font-medium">
                  Welcome Back to Assista Builder
                </h2>
              </div>
            </div>

            <p className="text-[#333] mb-5">
              Explore the world of Assista Builder to turn your ideas into
              intelligent workflows.
            </p>

            <div className="relative mb-3">
              <textarea
                rows={6}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="bg-[#ffffff45] w-full p-5 pb-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:black focus:border-black resize-none transition duration-300"
              ></textarea>
              {inputValue === "" && !isFocused && (
                <div className="absolute inset-0 px-6 pt-6 pointer-events-none">
                  <span
                    className={`text-[#a5a5a5] block transition-transform duration-300 ease-in-out transform ${
                      isFlipping
                        ? "translate-y-2 opacity-0"
                        : "translate-y-0 opacity-100"
                    }`}
                    aria-hidden="true"
                  >
                    {placeholders[phIndex]}
                  </span>
                </div>
              )}
              <div className="flex justify-between absolute bottom-6 left-4 right-4 items-center">
                <button className="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M12 4a5 5 0 0 0-5 5v6a1 1 0 1 1-2 0V9a7 7 0 1 1 14 0v8a5 5 0 0 1-10 0V9a3 3 0 0 1 6 0v8a1 1 0 1 1-2 0V9a1 1 0 1 0-2 0v8a3 3 0 0 0 6 0V9a5 5 0 0 0-5-5"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div>
                  <button className="flex items-center gap-3 cursor-pointer bg-[var(--primary-color)] text-white px-6 py-3 rounded-full hover:bg-[#666] transition duration-300">
                    Generate Workflow{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="currentColor"
                        d="m476.59 227.05l-.16-.07L49.35 49.84A23.56 23.56 0 0 0 27.14 52A24.65 24.65 0 0 0 16 72.59v113.29a24 24 0 0 0 19.52 23.57l232.93 43.07a4 4 0 0 1 0 7.86L35.53 303.45A24 24 0 0 0 16 327v113.31A23.57 23.57 0 0 0 26.59 460a23.94 23.94 0 0 0 13.22 4a24.55 24.55 0 0 0 9.52-1.93L476.4 285.94l.19-.09a32 32 0 0 0 0-58.8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <p>Start Searching :</p>
              <div className="flex flex-wrap gap-2 items-center">
                <button className="cursor-pointer px-3 py-1 text-sm text-[#666]  border border-gray-300 hover:border-gray-600 transition duration-300 rounded-2xl">
                  Tipping Calculator
                </button>
                <button className="cursor-pointer px-3 py-1 text-sm text-[#666]  border border-gray-300 hover:border-gray-600 transition duration-300 rounded-2xl">
                  Recipie Generator
                </button>
                <button className="cursor-pointer px-3 py-1 text-sm text-[#666]  border border-gray-300 hover:border-gray-600 transition duration-300 rounded-2xl">
                  ERP Dashboard
                </button>
                <button className="cursor-pointer px-3 py-1 text-sm text-[#666]  border border-gray-300 hover:border-gray-600 transition duration-300 rounded-2xl">
                  Expense Tracker
                </button>
                <button className="cursor-pointer px-3 py-1 text-sm text-[#666]  border border-gray-300 hover:border-gray-600 transition duration-300 rounded-2xl">
                  Landing Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Page;
