"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "What is Web Builder?",
    answer:
      "Web Builder is an AI-powered website creation platform that allows you to create websites using simple natural-language prompts.",
  },
  {
    question: "How does the AI Website Builder work?",
    answer:
      "Simply describe the website you want to create. Our AI analyzes your requirements and generates the website structure, content, styling, and code.",
  },
  {
    question: "Do I need coding knowledge to use Web Builder?",
    answer:
      "No. You don't need advanced coding knowledge. You can describe your idea in plain language and let the AI handle the initial website generation.",
  },
  {
    question: "What AI model does Web Builder use?",
    answer:
      "Web Builder uses Poolside AI's Laguna S-2 model through OpenRouter to understand user prompts and generate website code.",
  },
  {
    question: "Can I preview my website before publishing it?",
    answer:
      "Yes. Web Builder provides a preview experience where you can see how your generated website looks before saving or publishing it.",
  },
  {
    question: "Can I save my generated websites?",
    answer:
      "Yes. Generated websites can be saved as projects so you can access and manage them later.",
  },
];

export default function faqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl text-white">
          Frequently Asked Questions
        </h2>

        <p className="text-gray-400 mt-3">
          Everything you need to know about Web Builder.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, index) => (
          <div
            key={index}
            className="border border-white/10 rounded-xl bg-white/5 overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left text-white bg-white/5 transition"
            >
              <span className="font-medium">{faq.question}</span>

              <ChevronDown
                className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ${
                openIndex === index
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pt-2 pb-5 text-gray-400 leading-7">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}