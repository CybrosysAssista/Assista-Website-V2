"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

function CaseStudies() {
  const tabs = [
    { id: "assista-performance", label: "Assista Performance" },
    { id: "assista-wiki", label: "Assista Wiki" },
    { id: "assista-news", label: "Assista News" },
    { id: "assista-air", label: "Assista Air" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const tickingRef = useRef(false);

  // Height offset for sticky nav (adjust if needed)
  const OFFSET = 150;

  useEffect(() => {
    const sections = tabs
      .map((t) => document.getElementById(t.id))
      .filter(Boolean);
    if (sections.length === 0) return;

    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY + OFFSET;
          const windowHeight = window.innerHeight;
          const docHeight = document.documentElement.scrollHeight;

          // If at bottom of page → activate last section
          if (window.innerHeight + window.scrollY >= docHeight - 5) {
            setActiveTab(tabs[tabs.length - 1].id);
          } else {
            // Find the closest section to current scroll position
            let current = tabs[0].id;
            for (let i = 0; i < sections.length; i++) {
              const sec = sections[i];
              if (sec.offsetTop <= scrollY) {
                current = sec.id;
              } else {
                break;
              }
            }
            setActiveTab(current);
          }

          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [tabs]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - OFFSET + 10;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="pb-10 pt-10">
      <div className="cmpad bg-[#3e78c90c] rounded-2xl pt-20 px-10">
        {/* Tabs */}
        <div className="sticky top-25 z-10">
          <nav className="bg-white flex flex-wrap gap-3 justify-center [box-shadow:0px_0px_20px_#00000014] p-3 rounded-full w-max mx-auto mb-20">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => scrollTo(t.id)}
                className={`cursor-pointer text-md font-medium px-8 py-3 rounded-full transition duration-200 ${
                  activeTab === t.id
                    ? "bg-black text-white"
                    : "bg-[#f7f7f7] text-gray-700 hover:bg-[#333] hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Sections */}
        <Section
          id="assista-performance"
          title={
            <>
              Streamline your <br /> Work with smart features
            </>
          }
          desc="Automate repetitive tasks, connect your favorite apps, and gain real-time insights to make smarter decisions."
          img="/img/banner1.webp"
          flip={false}
        />

        <Section
          id="assista-wiki"
             title={
            <>
              Streamline your <br /> Work with smart features
            </>
          }
          desc="Quickly create, modify, and organize tasks with a clean, intuitive interface that enhances productivity and clarity."
          img="/img/banner2.webp"
          flip={true}
        />

        <Section
          id="assista-news"
             title={
            <>
              Streamline your <br /> Work with smart features
            </>
          }
          desc="Work together in real time, share ideas, and track progress effortlessly with built-in collaboration tools."
          img="/img/banner3.webp"
          flip={false}
        />

        <Section
          id="assista-air"
             title={
            <>
              Streamline your <br /> Work with smart features
            </>
          }
          desc="Sync discussions, documents, and progress updates across teams — ensuring everyone stays aligned at every step."
          img="/img/banner.webp"
          flip={true}
        />
      </div>
    </div>
  );
}

// Reusable section component
function Section({ id, title, desc, img, flip }) {
  return (
    <section id={id} className="scroll-mt-[180px]">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-10 ${
          flip ? "md:flex-row-reverse" : ""
        }`}
      >
        {flip ? (
          <>
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-medium mb-3 leading-13">{title}</h2>
              <p className="leading-7 text-[#7e7e7e] max-w-[700px] mb-8 text-lg">
                {desc}
              </p>
            </div>
            <div>
              <Image
                src={img}
                alt=""
                width={600}
                height={600}
                className="m-auto"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <Image
                src={img}
                alt=""
                width={600}
                height={600}
                className="m-auto"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-medium mb-3 leading-13">{title}</h2>
              <p className="leading-7 text-[#7e7e7e] max-w-[700px] mb-8 text-lg">
                {desc}
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default CaseStudies;
