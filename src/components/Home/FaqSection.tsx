"use client";

import { useState } from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import Heading from "../shared/Heading";

const faqs = [
  {
    question: "How does QuickHire help me find the best jobs?",
    answer:
      "QuickHire uses advanced AI algorithms to match your skills and experience with the most relevant job openings. We also provide a standardized platform where top companies post their vacancies directly.",
  },
  {
    question: "Is there a fee for job seekers to use the platform?",
    answer:
      "No, QuickHire is completely free for job seekers. You can browse jobs, create your profile, and apply to unlimited positions without any hidden costs.",
  },
  {
    question: "How can I make my profile stand out to recruiters?",
    answer:
      "To stand out, ensure your profile is 100% complete with a professional photo, detailed work history, and a clear list of your skills. You can also take our skill assessment tests to gain 'Verified' badges.",
  },
  {
    question: "How do I know if my application was viewed?",
    answer:
      "QuickHire provides real-time tracking for all your applications. You'll receive notifications when a recruiter views your profile, downloads your resume, or requests an interview.",
  },
  {
    question: "Can I apply for multiple jobs at the same time?",
    answer:
      "Yes! You can apply to as many jobs as you like. We recommend tailoring your application for each role to increase your chances of getting hired.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 relative overflow-hidden bg-card">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
            <Heading first="Common" second="Questions" />
            <p className="mt-4 text-muted-foreground font-epilogue max-w-2xl mx-auto">
                Everything you need to know about the platform and how to accelerate your career.
            </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={cn(
                "group rounded-2xl border transition-all duration-300",
                openIndex === index
                  ? "border-primary/30 bg-primary/5 shadow-sm shadow-primary/10"
                  : "border-border/50 bg-card hover:border-primary/20 hover:bg-muted/30"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-5 text-left md:p-6"
              >
                <span className="font-clash text-lg font-bold text-foreground md:text-xl">
                  {faq.question}
                </span>
                <span className={cn(
                    "ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300",
                    openIndex === index ? "bg-primary text-white rotate-180" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                  {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="p-5 pt-0 md:p-6 md:pt-0">
                  <p className="font-epilogue text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
