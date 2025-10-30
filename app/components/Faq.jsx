"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

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

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="cmpad">
      <div className="px-0 md:px-15 py-0 pb-15 md:py-15">
        <h2 className="mainhead relative w-max m-auto">
          <Image
            src="/img/arrow2.svg"
            alt=""
            width={100}
            height={100}
            className="absolute -right-30 -top-6"
          />
          Frequently Asked
          <span className="underlineimg"> Questions</span>
        </h2>

        <p className="leading-7 text-[#7e7e7e] text-center max-w-[750px] mx-auto mb-20 text-lg">
          Find answers to common queries about features, setup, and how Assista
          enhances your Odoo development experience.
        </p>

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
                    isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-[#7e7e7e] text-lg">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>

        <a href="" className="mt-8 flex justify-center items-center px-8 py-3 bg-[#333] text-white rounded-full hover:bg-[#666] transition duration-300 mx-auto w-fit">View all FAQ</a>
      </div>
    </section>
  );
}
