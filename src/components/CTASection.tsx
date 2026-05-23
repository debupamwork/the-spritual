import React from "react";
import { MessageSquare, CalendarCheck } from "lucide-react";

interface CTASectionProps {
  whatsappNumber: string;
  onOpenEnquiry: () => void;
}

export default function CTASection({ whatsappNumber, onOpenEnquiry }: CTASectionProps) {
  const whatsappMessage = encodeURIComponent("Hi, I want thespritual.in tour details. Please customize a plan starting from Guwahati.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section id="final-cta" className="py-16 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        
        {/* Dynamic Badge */}
        <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20 mb-4">
          <CalendarCheck className="w-3 h-3" /> Book Confidently
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Secure Best Seasonal Rates
        </h2>
        
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed">
          Submit tentative details now to hold current private cab fares and check balcony hotel unit availability.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-8 max-w-md mx-auto">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
            <span>Chat on WhatsApp</span>
          </a>

          <button
            onClick={onOpenEnquiry}
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Submit Enquiry
          </button>
        </div>

      </div>
    </section>
  );
}
