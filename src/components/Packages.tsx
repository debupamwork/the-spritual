import React, { useState } from "react";
import { Check, Clock, ShieldCheck, MessageSquare, Plus, Minus, ArrowUpRight } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

interface PackagesProps {
  onSelectPackage: (title: string) => void;
  whatsappNumber: string;
}

const renderEmphasizedText = (text: string) => {
  const config = [
    { key: "VIP Special Entry", highlight: "VIP Special Entry" },
    { key: "Special VIP", highlight: "Special VIP" },
    { key: "VIP pass", highlight: "VIP pass" },
    { key: "Dedicated pandit", highlight: "Dedicated pandit" },
    { key: "Sunset Dinner Cruise", highlight: "Sunset Dinner Cruise" },
    { key: "5-star luxury hotel", highlight: "5-star luxury hotel" },
    { key: "Wei Sawdong", highlight: "Wei Sawdong" },
    { key: "Nohkalikai", highlight: "Nohkalikai" },
    { key: "Mawlynnong", highlight: "Mawlynnong" },
    { key: "Living Root", highlight: "Living Root" },
    { key: "transparent glass-like", highlight: "transparent glass-like" },
    { key: "balcony views", highlight: "balcony views" },
    { key: "Laitlum Canyons", highlight: "Laitlum Canyons" },
    { key: "river-side camps", highlight: "river-side camps" },
    { key: "certified expert driver", highlight: "certified expert driver" }
  ];

  const matched = config.find(item => text.toLowerCase().includes(item.key.toLowerCase()));
  
  if (matched) {
    const index = text.toLowerCase().indexOf(matched.key.toLowerCase());
    const before = text.substring(0, index);
    const matchText = text.substring(index, index + matched.key.length);
    const after = text.substring(index + matched.key.length);
    return (
      <>
        {before}
        <span className="font-extrabold text-teal-950 bg-emerald-100/50 px-1.5 py-0.5 rounded transition-all">
          {matchText}
        </span>
        {after}
      </>
    );
  }

  const words = text.split(" ");
  if (words.length > 2) {
    const boldCount = Math.min(2, words.length);
    const highlightedPart = words.slice(0, boldCount).join(" ");
    const remainingPart = words.slice(boldCount).join(" ");
    return (
      <>
        <span className="font-extrabold text-slate-900 bg-teal-50/60 px-1.5 py-0.5 rounded transition-all">
          {highlightedPart}
        </span>{" "}
        {remainingPart}
      </>
    );
  }

  return text;
};

export default function Packages({ onSelectPackage, whatsappNumber }: PackagesProps) {
  const { packages } = useSettings();
  const [selectedItineraryId, setSelectedItineraryId] = useState<string | null>(null);

  const toggleItinerary = (id: string) => {
    setSelectedItineraryId(selectedItineraryId === id ? null : id);
  };

  const getWhatsAppForPackage = (pkgTitle: string) => {
    const text = `Hi, I am interested in booking the "${pkgTitle}" package starting from Guwahati. Please share details.`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="packages" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {packages.map((pkg) => {
            const isItineraryOpen = selectedItineraryId === pkg.id;
            return (
              <div
                key={pkg.id}
                id={pkg.id}
                className={`relative flex flex-col h-full rounded-2xl bg-white border transition-all duration-300 ${
                  pkg.popular
                    ? "border-teal-600 shadow-md ring-1 ring-teal-600 lg:-translate-y-1 z-10"
                    : "border-slate-100 hover:border-slate-300"
                }`}
              >
                {/* Popular Ribbon */}
                {pkg.popular && (
                  <div className="absolute top-0 right-6 -translate-y-1/2 bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm z-20 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Popular Choice
                  </div>
                )}

                {/* Package Main Details */}
                <div className="p-6 flex-grow space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1 text-teal-600">
                      <Clock className="w-3 h-3" /> {pkg.duration}
                    </span>
                    <span>From Guwahati</span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    {pkg.title}
                  </h3>

                  <div className="bg-gradient-to-r from-teal-50/50 to-emerald-50/10 border-l-4 border-teal-500 rounded-lg p-3.5 shadow-sm">
                    <p className="text-[13px] font-semibold text-slate-700 leading-relaxed italic">
                      "{pkg.description}"
                    </p>
                  </div>

                  {/* Highlights Key List Section */}
                  <div className="space-y-3 pt-2">
                    <div className="text-[10px] font-black uppercase text-teal-800 tracking-widest flex items-center gap-1.5 select-none opacity-90">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                      </span>
                      <span>Experience Highlights</span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {pkg.highlights.map((highlight, idx) => (
                        <div 
                          key={idx} 
                          className="group/item flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100/70 hover:bg-emerald-50/40 hover:border-emerald-300 transition-all duration-300 shadow-sm"
                        >
                          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5 group-hover/item:scale-110 transition-all duration-200">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                          <span className="text-xs text-slate-600 leading-snug font-medium group-hover/item:text-slate-900 transition-colors">
                            {renderEmphasizedText(highlight)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => toggleItinerary(pkg.id)}
                      className="w-full flex items-center justify-between text-[11px] font-bold text-teal-600 hover:text-teal-700 bg-slate-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>
                        {isItineraryOpen ? "Hide Plan" : "View Day-by-Day Plan"}
                      </span>
                      {isItineraryOpen ? (
                        <Minus className="w-3 h-3" />
                      ) : (
                        <Plus className="w-3 h-3" />
                      )}
                    </button>

                    {/* Expandable Itinerary */}
                    {isItineraryOpen && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-200">
                        {pkg.itinerary.map((dayPlan) => (
                          <div key={dayPlan.day} className="relative pl-5 pb-1 last:pb-0 border-l border-teal-100 text-left">
                            <div className="absolute top-0 left-0 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-teal-600 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
                              {dayPlan.day}
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 leading-none">
                              Day {dayPlan.day}: {dayPlan.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                              {dayPlan.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing & Booking Funnel */}
                <div className="p-6 bg-slate-50/50 rounded-b-2xl border-t border-slate-100">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider block">Estimated Price</span>
                      <span className="text-lg font-extrabold text-teal-700">{pkg.priceEstimate}</span>
                      <span className="text-[9px] text-slate-400 block">/ person base fare</span>
                    </div>
                    <span className="text-[10px] text-slate-500 text-right max-w-[100px] leading-tight block">
                      Cab, Hotel, Breakfast, Driver Incl.
                    </span>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => onSelectPackage(pkg.title)}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md shadow-teal-600/10"
                    >
                      <span>Book Direct & Pay</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={getWhatsAppForPackage(pkg.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1 bg-white hover:bg-slate-100 text-emerald-800 border border-slate-200 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-emerald-800 text-emerald-500" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
