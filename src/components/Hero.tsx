import React, { useState, useEffect } from "react";
import { MessageSquare, ChevronDown, Check, Star, ShieldCheck } from "lucide-react";

interface HeroProps {
  whatsappNumber: string;
  onViewPackages: () => void;
  onOpenEnquiry: () => void;
}

const HERO_SLIDES = [
  {
    title: "Sacred Kamakhya VIP",
    subtitle: "Fast-Track Blessings",
    desc: "Pre-arranged special temple entry passes & dedicated private guide.",
    image: "https://images.unsplash.com/photo-1615966650071-855b15f29ad1?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Shillong Mist Hills",
    subtitle: "High-Altitude Nature",
    desc: "Breathtaking mountain canyons, waterfalls & comfortable stays.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Dawki Water Escapes",
    subtitle: "Pristine Valley Adventure",
    desc: "Trek historic living root bridges & ride crystal glass water streams.",
    image: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=600&q=80",
  }
];

export default function Hero({ whatsappNumber, onViewPackages, onOpenEnquiry }: HeroProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIndex((prevIndex) => (prevIndex + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const whatsappMessage = encodeURIComponent("Hi! I am interested in booking a customizable Northeast tour (Kamakhya VIP + Shillong / Meghalaya packages). Please share rates!");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section id="hero" className="relative pt-24 pb-14 md:pt-32 md:pb-20 overflow-hidden bg-white">
      {/* Visual background accents */}
      <div className="absolute top-0 right-0 w-[35%] h-[35%] bg-teal-50/50 blur-3xl rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text Content Area */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Minimal Rating Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              <span className="flex text-amber-500">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              </span>
              <span className="text-[11px] font-bold text-slate-600">4.9/5 Rated Premium Northeast Partner</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Custom Northeast <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  Holidays & Sacred Tours
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed">
                All-in-one personalized private tours starting from Guwahati. We seamlessly pair <strong>Maa Kamakhya VIP entry</strong> with the majestic peaks of <strong>Shillong</strong> and <strong>Dawki crystal rivers</strong>.
              </p>
            </div>

            {/* Clean, lightweight ticks */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
              {[
                "Maa Kamakhya VIP entry passes",
                "Misty Shillong valley hotels",
                "Dawki crystal water boat tours",
                "Private SUV with professional driver"
              ].map((tick, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{tick}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/10"
              >
                <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
                <span>Get WhatsApp Quote</span>
              </a>
              
              <button
                onClick={onViewPackages}
                className="bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm px-6 py-3.5 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Browse Packages</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>

            {/* Clean minimal trust badge */}
            <div className="pt-2 flex items-center gap-4 text-slate-400">
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Assam & Meghalaya Tourism Partner</span>
              </div>
              <span className="text-slate-200">|</span>
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <span>Flexible Rescheduling</span>
              </div>
            </div>
          </div>

          {/* Animated Slideshow Image Area */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0 flex flex-col items-center">
            <div className="relative w-full max-w-[380px]">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-slate-50 relative">
                {HERO_SLIDES.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      index === activeSlideIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>

              {/* Smaller floating element showing active slide details dynamically */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-100 shadow-xl text-center z-20 min-h-[75px] flex flex-col justify-center">
                <p className="text-[10px] font-extrabold text-teal-600 uppercase tracking-widest leading-none">
                  {HERO_SLIDES[activeSlideIndex].subtitle}
                </p>
                <p className="text-xs font-black text-slate-900 mt-1">
                  {HERO_SLIDES[activeSlideIndex].title}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5 px-1 leading-normal font-medium max-w-[320px] mx-auto">
                  {HERO_SLIDES[activeSlideIndex].desc}
                </p>
              </div>
            </div>

            {/* Quick interactive mini tabs / pillars underneath with minimal text */}
            <div className="flex gap-2 mt-4 justify-center items-center z-20">
              {HERO_SLIDES.map((slide, index) => {
                const isActive = index === activeSlideIndex;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveSlideIndex(index)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer select-none ${
                      isActive
                        ? "bg-slate-900 border-slate-900 text-white shadow-sm font-extrabold scale-105"
                        : "bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300"
                    }`}
                  >
                    {slide.title}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
