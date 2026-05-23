import React, { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { FAQsList } from "../data";

interface FAQProps {
  onOpenEnquiry: () => void;
}

export default function FAQ({ onOpenEnquiry }: FAQProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-[10px] bg-white text-slate-500 font-bold uppercase tracking-widest px-3 py-1 rounded border border-slate-100">
            FAQ
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Common Questions
          </h2>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {FAQsList.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white border border-slate-100 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-teal-600 transition-colors cursor-pointer select-none"
                >
                  <span className="text-xs sm:text-sm leading-tight flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-teal-500 shrink-0" />
                    {faq.question}
                  </span>
                  <span className="w-6 h-6 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 shrink-0 border border-slate-100">
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </span>
                </button>
                
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-500 leading-relaxed animate-in fade-in duration-200">
                    <div className="pl-6 border-l border-teal-500">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
