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
      <div className="">
        <div className="cmpad pt-40 slider inslider lg:h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Image src="/img/idelogo.svg" alt="" width={50} height={50} />
                <span className="font-semibold text-4xl text-[#818181]">
                  Assista IDE
                </span>
              </div>

              <h1 className="text-[35px] sm:text-[45px] font-medium mb-3 leading-12 md:leading-15">
                The AI powered IDE to
                <br className="hidden lg:block" /> Code smarter
                <span className="brush brushide">build faster.</span>
              </h1>
              <p className="max-w-[600px] leading-7 text-[#7e7e7e]">
                Assita IDE combines intelligent code assistance and real-time
                collaboration to your workflow from concept to all in one place.
              </p>

              <div className="flex gap-2 mt-10 mb-3 md:mb-15">
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

        <div className="sticky top-22 z-10 overflow-hidden overflow-x-auto pt-4 md:mb-4">
          <nav className="bg-white flex flex-wrap gap-3 justify-center [box-shadow:0px_0px_20px_#00000014] p-3 rounded-full w-max mx-auto mb-1 lg:mb-20">
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

        <div className="cmpad pt-10 pb-10 md:pt-0 md:pb-10">
          <section id="ide-docs" className="mb-16">
            <div className="text-center">
              <span className="badge">IDE Docs</span>
            </div>

            <h2 className="mainhead relative w-max m-auto">
              Grow business with{" "}
              <span className="underlineimg underlineide">
                automation tools
              </span>
            </h2>

            <p className="leading-7 text-[#7e7e7e] text-center max-w-[750px] mx-auto mb-15 text-lg">
              Simplify your workflows, boost productivity, and manage every
              process with ease all from one intuitive dashboard built to scale
              with your business.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-[90%] mx-auto">
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
                <h2 className="text-3xl md:text-4xl font-medium mb-3 leading-10 md:leading-13">
                  Streamline your <br /> Wrok with smart features
                </h2>

                <p className="leading-7 text-[#7e7e7e] max-w-[700px] lg:mx-auto mb-8 text-lg">
                  Automate repetitive tasks connect your favorite apps, and gain
                  real-time insights to make smarter decisions helping your team
                  work faster and more efficiently.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-[90%] mx-auto">
              <div className="order-2 lg:order-1 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-medium mb-3 leading-10 md:leading-13">
                  Streamline your <br /> Wrok with smart features
                </h2>

                <p className="leading-7 text-[#7e7e7e] max-w-[700px] lg:mx-auto mb-8 text-lg">
                  Automate repetitive tasks connect your favorite apps, and gain
                  real-time insights to make smarter decisions helping your team
                  work faster and more efficiently.
                </p>
              </div>
              <div className="order-1 lg:order-2">
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
            <div className="text-center">
              <span className="badge">Create</span>
            </div>

            <h2 className="mainhead relative w-max m-auto">
              Grow business with{" "}
              <span className="underlineimg underlineide">
                automation tools
              </span>
            </h2>

            <p className="leading-7 text-[#7e7e7e] text-center max-w-[750px] mx-auto mb-15 text-lg">
              Simplify your workflows, boost productivity, and manage every
              process with ease all from one intuitive dashboard built to scale
              with your business.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-[90%] mx-auto">
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
                <h2 className="text-3xl md:text-4xl font-medium mb-3 leading-10 md:leading-13">
                  Streamline your <br /> Wrok with smart features
                </h2>

                <p className="leading-7 text-[#7e7e7e] max-w-[700px] lg:mx-auto mb-8 text-lg">
                  Automate repetitive tasks connect your favorite apps, and gain
                  real-time insights to make smarter decisions helping your team
                  work faster and more efficiently.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-[90%] mx-auto">
              <div className="order-2 lg:order-1 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-medium mb-3 leading-10 md:leading-13">
                  Streamline your <br /> Wrok with smart features
                </h2>

                <p className="leading-7 text-[#7e7e7e] max-w-[700px] lg:mx-auto mb-8 text-lg">
                  Automate repetitive tasks connect your favorite apps, and gain
                  real-time insights to make smarter decisions helping your team
                  work faster and more efficiently.
                </p>
              </div>
              <div className="order-1 lg:order-2">
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

          <section id="collaborate" className="mb-16">
            <div className="text-center">
              <span className="badge">Collaborate</span>
            </div>

            <h2 className="mainhead relative w-max m-auto">
              Work together with{" "}
              <span className="underlineimg underlineide">
                real-time collaboration
              </span>
            </h2>

            <p className="leading-7 text-[#7e7e7e] text-center max-w-[750px] mx-auto mb-15 text-lg">
              Enable seamless teamwork with real-time editing, instant
              messaging, and shared workspaces that keep your entire team in
              sync.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-[90%] mx-auto">
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
                <h2 className="text-3xl md:text-4xl font-medium mb-3 leading-10 md:leading-13">
                  Real-time <br /> Collaboration tools
                </h2>

                <p className="leading-7 text-[#7e7e7e] max-w-[700px] lg:mx-auto mb-8 text-lg">
                  Share your workspace, edit code together, and communicate
                  seamlessly with built-in chat and video calling features.
                </p>
              </div>
            </div>
          </section>

          <section id="security" className="mb-16">
            <div className="text-center">
              <span className="badge">Security</span>
            </div>

            <h2 className="mainhead relative w-max m-auto">
              Enterprise grade{" "}
              <span className="underlineimg underlineide">
                security features
              </span>
            </h2>

            <p className="leading-7 text-[#7e7e7e] text-center max-w-[750px] mx-auto mb-15 text-lg">
              Protect your code and data with advanced security measures,
              encryption, and compliance standards.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-[90%] mx-auto">
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-medium mb-3 leading-10 md:leading-13">
                  Secure your <br /> Development environment
                </h2>

                <p className="leading-7 text-[#7e7e7e] max-w-[700px] lg:mx-auto mb-8 text-lg">
                  Advanced encryption, secure authentication, and compliance
                  with industry standards to keep your projects safe.
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

          <section id="customers" className="mb-16">
            <div className="text-center">
              <span className="badge">Customers</span>
            </div>

            <h2 className="mainhead relative w-max m-auto">
              Trusted by thousands of
              <span className="underlineimg underlineide"> developers</span>
            </h2>

            <p className="leading-7 text-[#7e7e7e] text-center max-w-[750px] mx-auto mb-15 text-lg">
              Join thousands of developers and teams who trust Assista IDE for
              their development needs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[90%] mx-auto">
              <div className="text-center p-6 bg-white rounded-lg [box-shadow:0px_0px_20px_#0000000d]">
                <h3 className="text-3xl font-semibold mb-2">10,000+</h3>
                <p className="text-[#7e7e7e]">Active Developers</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg [box-shadow:0px_0px_20px_#0000000d]">
                <h3 className="text-3xl font-semibold mb-2">500+</h3>
                <p className="text-[#7e7e7e]">Enterprise Teams</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg [box-shadow:0px_0px_20px_#0000000d]">
                <h3 className="text-3xl font-semibold mb-2">99.9%</h3>
                <p className="text-[#7e7e7e]">Customer Satisfaction</p>
              </div>
            </div>
          </section>

          <section id="faq" className="mb-16">
            <div className="text-center">
              <span className="badge">FAQ</span>
            </div>

            <h2 className="mainhead relative w-max m-auto">
              Frequently Asked{" "}
              <span className="underlineimg underlineide">Questions</span>
            </h2>

            <p className="leading-7 text-[#7e7e7e] text-center max-w-[750px] mx-auto mb-15 text-lg">
              Find answers to common queries about features, setup, and how
              Assista enhances your Odoo development experience.
            </p>

            <div className="max-w-[800px] mx-auto">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg [box-shadow:0px_0px_20px_#0000000d]">
                  <h3 className="text-xl font-semibold mb-3">
                    What is Assista IDE?
                  </h3>
                  <p className="text-[#7e7e7e]">
                    Assista IDE is an AI-powered integrated development
                    environment that combines intelligent code assistance with
                    real-time collaboration features.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg [box-shadow:0px_0px_20px_#0000000d]">
                  <h3 className="text-xl font-semibold mb-3">
                    How does the AI assistance work?
                  </h3>
                  <p className="text-[#7e7e7e]">
                    Our AI analyzes your code patterns and provides intelligent
                    suggestions, auto-completion, and error detection to help
                    you code faster and more efficiently.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg [box-shadow:0px_0px_20px_#0000000d]">
                  <h3 className="text-xl font-semibold mb-3">
                    Is there a free trial available?
                  </h3>
                  <p className="text-[#7e7e7e]">
                    Yes, we offer a 14-day free trial with full access to all
                    features. No credit card required.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Page;
