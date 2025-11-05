'use client'
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";

const faqs = [
  {
    question: "What is Assista, and how does it enhance Odoo development?",
    answer:
      "Assista is an AI-powered IDE plugin specifically built to streamline Odoo development workflows with intelligent suggestions, shortcuts, and tools.",
  },
  {
    question:
      "Which development environments or IDEs are compatible with Assista?",
    answer:
      "Assista is available for VS Code, PyCharm, VSCodium, and more popular development environments.",
  },
  {
    question: "Is there a free version of Assista available for developers?",
    answer:
      "Assista offers both free and premium plans with additional features and support for enterprise teams.",
  },
  {
    question: "How does Assista improve my productivity?",
    answer:
      "It helps with auto-code generation, module scaffolding, and context-aware AI prompts for faster Odoo customization.",
  },
];

function page() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <div>
      <Header />
      <div className="pt-40 pb-10">
        <div className="container-fluid cmpad">
          <div className="mb-10">
            <h2 className="mainhead relative w-max m-auto">
              Shaping the Future{" "}
              <span className="brush relative">
                <Image
                  src="/img/arrow.svg"
                  alt=""
                  width={100}
                  height={100}
                  className="absolute -right-25 -top-6"
                />{" "}
                with Assista
              </span>
            </h2>
            <p className="max-w-2xl text-center mx-auto text-[#58586b] leading-relaxed">
              At Cybrosys, we envision Assista as a platform that blends
              intelligence helping businesses automate the power of AI.
            </p>
            <nav className="breadcrumb justify-center mt-5 text-sm sm:text-base">
              <a href="#">Home</a>
              <span>›</span>
              <span className="active">FAQ</span>
            </nav>
          </div>

          <div className="p-4 sm:p-6 md:p-10 mb-5">
            <div className="max-w-5xl mx-auto mb-8">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className="border border-[#dadada] p-4 rounded-md mb-3 transition-all duration-300"
                  >
                    <button
                      onClick={() => toggle(index)}
                      className="w-full text-left text-[#333] cursor-pointer font-medium text-lg flex justify-between items-center"
                    >
                      {faq.question}
                      <span className="primary-color text-2xl">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    <div
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${
                        isOpen
                          ? "max-h-96 opacity-100 mt-4"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-[#7e7e7e] text-lg">{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default page;
