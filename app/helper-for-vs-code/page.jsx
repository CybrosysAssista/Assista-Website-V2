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
      <div className="cmpad pt-30 slider inslider vscodeslider">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Image src="/img/vscode.svg" alt="" width={50} height={50} />
              <span className="font-semibold text-4xl text-[#818181]">
                Helper for VS Code
              </span>
            </div>

            <h1 className="text-5xl font-medium mb-3 leading-15">
              Empower your <br /> Ideas with
              <span className="brush brushvscode">Odoo Helper.</span>
            </h1>
            <p className="max-w-[600px] leading-7 text-[#7e7e7e]">
              Streamline Odoo development in VS Code with smart suggestions,
              templates, and insights all in one powerful extension.
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

      {/* Tab Navigation */}
      <div className="cmpad py-20">
        <div className="sticky top-25 z-10">
          <nav className="bg-white flex flex-wrap gap-3 justify-center [box-shadow:0px_0px_20px_#00000014] p-3 rounded-full w-max mx-auto mb-20">
            {tabs.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(t.id);
                }}
                aria-current={activeTab === t.id ? "true" : "false"}
                className={`text-md font-medium px-8 py-3 rounded-full transition duration-200 ${
                  activeTab === t.id
                    ? "bg-[black] text-white"
                    : "bg-[#f7f7f7] text-gray-700 hover:bg-[#333] hover:text-white"
                }`}
              >
                {t.label}
              </a>
            ))}
          </nav>
        </div>

        <section id="ide-docs" className="mb-16">
          <div style={{ textAlign: "center" }}>
            <span className="badge">IDE Docs</span>
          </div>

          <h2 className="mainhead relative w-max m-auto">
            Grow business with{" "}
            <span className="underlineimg underlinea">automation tools</span>
          </h2>

          <p className="leading-7 text-[#7e7e7e] text-center max-w-[750px] mx-auto mb-15 text-lg">
            Simplify your workflows, boost productivity, and manage every
            process with ease all from one intuitive dashboard built to scale
            with your business.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[90%] mx-auto">
            <div>
              <Image
                src="/img/banner1.webp"
                alt=""
                width={600}
                height={600}
                className="m-auto"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-medium mb-3 leading-13">
                Streamline your <br /> Wrok with smart features
              </h2>

              <p className="leading-7 text-[#7e7e7e] max-w-[700px] mx-auto mb-8 text-lg">
                Automate repetitive tasks connect your favorite apps, and gain
                real-time insights to make smarter decisions helping your team
                work faster and more efficiently.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[90%] mx-auto">
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-medium mb-3 leading-13">
                Streamline your <br /> Wrok with smart features
              </h2>

              <p className="leading-7 text-[#7e7e7e] max-w-[700px] mx-auto mb-8 text-lg">
                Automate repetitive tasks connect your favorite apps, and gain
                real-time insights to make smarter decisions helping your team
                work faster and more efficiently.
              </p>
            </div>
            <div>
              <Image
                src="/img/banner1.webp"
                alt=""
                width={600}
                height={600}
                className="m-auto"
              />
            </div>
          </div>
        </section>

        <section id="create" className="mb-16">
          <div style={{ textAlign: "center" }}>
            <span className="badge">Create</span>
          </div>

          <h2 className="mainhead relative w-max m-auto">
            Grow business with{" "}
            <span className="underlineimg underlinea">automation tools</span>
          </h2>

          <p className="leading-7 text-[#7e7e7e] text-center max-w-[750px] mx-auto mb-15 text-lg">
            Simplify your workflows, boost productivity, and manage every
            process with ease all from one intuitive dashboard built to scale
            with your business.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[90%] mx-auto">
            <div>
              <Image
                src="/img/banner1.webp"
                alt=""
                width={600}
                height={600}
                className="m-auto"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-medium mb-3 leading-13">
                Streamline your <br /> Wrok with smart features
              </h2>

              <p className="leading-7 text-[#7e7e7e] max-w-[700px] mx-auto mb-8 text-lg">
                Automate repetitive tasks connect your favorite apps, and gain
                real-time insights to make smarter decisions helping your team
                work faster and more efficiently.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[90%] mx-auto">
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-medium mb-3 leading-13">
                Streamline your <br /> Wrok with smart features
              </h2>

              <p className="leading-7 text-[#7e7e7e] max-w-[700px] mx-auto mb-8 text-lg">
                Automate repetitive tasks connect your favorite apps, and gain
                real-time insights to make smarter decisions helping your team
                work faster and more efficiently.
              </p>
            </div>
            <div>
              <Image
                src="/img/banner1.webp"
                alt=""
                width={600}
                height={600}
                className="m-auto"
              />
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default Page;
