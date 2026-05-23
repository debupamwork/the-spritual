import React, { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext";
import { ChevronRight, MessageSquare } from "lucide-react";

interface ImageCarouselProps {
  onOpenEnquiry?: () => void;
}

export default function ImageCarousel({ onOpenEnquiry }: ImageCarouselProps) {
  const { whatsappNumber, carouselSlides } = useSettings();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    if (!carouselSlides || carouselSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % carouselSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [carouselSlides]);

  const handleScrollToPackages = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById("packages");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const whatsappMessage = encodeURIComponent(
    "Hi Travel Coordinator, I'd like to get an instant cost quote for a customizable Northeast tour package starting from Guwahati. Kindly share rates."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="w-full mb-16">
      <div className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[580px] sm:min-h-[660px] md:min-h-[740px] lg:min-h-[82vh] flex items-end justify-center animate-in fade-in duration-900">
        
         {/* Absolute Dynamic Background Images Carousel with Soft Overlay */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          {carouselSlides && carouselSlides.length > 0 ? (
            carouselSlides.map((slide, index) => (
              <div
                key={slide.id || index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === activeSlideIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
              >
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="w-full h-full object-cover transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))
          ) : (
            <img 
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&h=900&q=80" 
              alt="Scenic Blue Mountain Scenery of Northeast" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
          {/* No darkening overlays or blurs to make background image 100% visible */}
        </div>

        {/* Content Box - Placed beautifully near the bottom edge matching the height */}
        <div className="relative z-10 w-full max-w-4xl px-6 pb-12 sm:pb-16 md:pb-20 flex flex-col justify-end items-center text-center space-y-6">
          
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase text-white tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] select-none">
              {carouselSlides && carouselSlides[activeSlideIndex] ? carouselSlides[activeSlideIndex].title : "Sacred Kamakhya VIP"}
            </h2>
          </div>

          {/* Action CTAs - Smaller more compact size */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-md pt-1.5">
            <button
              onClick={handleScrollToPackages}
              className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-950 font-extrabold text-xs px-5 py-3.5 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-xl active:scale-95 w-full sm:w-auto"
              id="btn-browse-packages"
            >
              <span>Browse Packages</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>

        </div>

        {/* Sideways Floating Sticky WhatsApp Rates Quote Button on the Right Viewport Boundary */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed right-0 top-[40%] -translate-y-1/2 z-50 origin-bottom-right -rotate-90 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] px-5 py-3.5 rounded-t-xl transition-all duration-300 shadow-2xl hover:brightness-110 active:scale-95 whitespace-nowrap"
          id="hero-whatsapp-side"
        >
          <MessageSquare className="w-3 h-3 fill-white text-emerald-600" />
          <span>WhatsApp Rates Quote</span>
        </a>

      </div>

      {/* Travel Quote Marquee Strip */}
      <div className="w-full bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white py-3.5 border-y border-teal-800/40 relative overflow-hidden select-none z-20 shadow-md">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes marquee-quotes {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-quotes {
            display: flex;
            width: max-content;
            animation: marquee-quotes 40s linear infinite;
          }
        `}} />
        
        {/* Subtle side blending gradients for absolute high fidelity */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none z-10" />

        <div className="animate-marquee-quotes flex items-center gap-16 text-xs sm:text-sm font-medium tracking-wide text-teal-100">
          {/* First block */}
          <div className="flex items-center gap-16 whitespace-nowrap">
            <span className="flex items-center gap-2.5">
              <span className="text-emerald-400 text-sm">✦</span>
              <span className="italic">"Jobs fill your pockets, but adventure fills your soul."</span>
              <span className="text-teal-400/70 font-bold ml-1 text-xs font-sans">— Jaime Lyn Beatty</span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className="text-emerald-400 text-sm">✦</span>
              <span className="italic">"The world is a book, and those who do not travel read only a page."</span>
              <span className="text-teal-400/70 font-bold ml-1 text-xs font-sans">— Saint Augustine</span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className="text-emerald-400 text-sm">✦</span>
              <span className="italic">"Travel is the only thing you buy that makes you richer."</span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className="text-emerald-400 text-sm">✦</span>
              <span className="italic">"Northeast India is not just a destination, it is an emotion to be experienced."</span>
            </span>
          </div>

          {/* Duplicated block for perfect infinite seamless scroll */}
          <div className="flex items-center gap-16 whitespace-nowrap" aria-hidden="true">
            <span className="flex items-center gap-2.5">
              <span className="text-emerald-400 text-sm">✦</span>
              <span className="italic">"Jobs fill your pockets, but adventure fills your soul."</span>
              <span className="text-teal-400/70 font-bold ml-1 text-xs font-sans">— Jaime Lyn Beatty</span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className="text-emerald-400 text-sm">✦</span>
              <span className="italic">"The world is a book, and those who do not travel read only a page."</span>
              <span className="text-teal-400/70 font-bold ml-1 text-xs font-sans">— Saint Augustine</span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className="text-emerald-400 text-sm">✦</span>
              <span className="italic">"Travel is the only thing you buy that makes you richer."</span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className="text-emerald-400 text-sm">✦</span>
              <span className="italic">"Northeast India is not just a destination, it is an emotion to be experienced."</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
