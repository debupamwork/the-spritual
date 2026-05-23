import React, { useState, useEffect } from "react";
import { Phone, Compass, MessageSquare, Menu, X, ShieldCheck } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

interface HeaderProps {
  whatsappNumber: string;
  onOpenEnquiry: () => void;
  currentView: "home" | "booking" | "mybookings" | "profile" | "admin";
  setCurrentView: (view: "home" | "booking" | "mybookings" | "profile" | "admin") => void;
}

export default function Header({ 
  whatsappNumber, 
  onOpenEnquiry, 
  currentView, 
  setCurrentView 
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (targetId === "online-booking") {
      setCurrentView("booking");
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      return;
    }

    const wasBookingView = currentView !== "home";
    setCurrentView("home");

    if (targetId === "hero") {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      return;
    }

    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 85;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, wasBookingView ? 150 : 0);
  };

  const whatsappMessage = encodeURIComponent("Hi, I want tour details from thespritual.in");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const { promotionalOffer } = useSettings();
  const hasPromo = !!promotionalOffer;
  const isTransparent = false;

  const headerClass = `fixed left-0 right-0 z-40 transition-all duration-300 bg-white border-b border-slate-200/90 shadow-md ${
    isScrolled 
      ? "top-0 py-3" 
      : hasPromo 
      ? "top-[28px] py-4" 
      : "top-0 py-4"
  }`;

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-1">
          {/* Logo with Elegant Serif Pairing & Compass Icon */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, "hero")}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-600/15 group-hover:scale-105 active:scale-95 transition-all duration-300">
              <Compass className="w-5.5 h-5.5 animate-spin-slow group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-sans tracking-[0.25em] text-slate-400 group-hover:text-teal-600 transition-colors duration-300 leading-none font-bold">
                THE PREMIER
              </span>
              <span className="font-serif italic text-xl md:text-2xl font-black text-slate-900 group-hover:text-teal-750 transition-colors duration-300 leading-none mt-0.5">
                the spritual
              </span>
            </div>
          </a>

          {/* Three Bar Menu Toggle (Always Cleanly Available) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl transition-all duration-300 bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 active:scale-95 text-slate-705 cursor-pointer flex items-center justify-center shadow-sm"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
          </button>
        </div>
      </div>

      {/* Navigation Overlay Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] md:top-[70px] z-35 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Card Drawer */}
          <div className="absolute top-2 right-4 w-72 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl py-5 px-5 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider block uppercase border-b border-slate-100 pb-2">
              Explore & Book
            </span>
            <nav className="flex flex-col gap-3">
              <a
                href="#packages"
                onClick={(e) => handleNavClick(e, "packages")}
                className="text-sm font-semibold text-slate-700 hover:text-teal-605 py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-all flex items-center justify-between"
              >
                <span>Popular Packages</span>
                <span className="text-[9px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-black font-sans tracking-wide">HOT</span>
              </a>
              <a
                href="#online-booking"
                onClick={(e) => handleNavClick(e, "online-booking")}
                className="text-sm font-semibold text-slate-700 hover:text-teal-605 py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-all"
              >
                Custom Itinerary Builder
              </a>
              <a
                href="#why-choose-us"
                onClick={(e) => handleNavClick(e, "why-choose-us")}
                className="text-sm font-semibold text-slate-700 hover:text-teal-605 py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-all"
              >
                Our Guarantees
              </a>
              <a
                href="#testimonials"
                onClick={(e) => handleNavClick(e, "testimonials")}
                className="text-sm font-semibold text-slate-705 hover:text-teal-605 py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-all"
              >
                Guest Reviews
              </a>
              <a
                href="#faq"
                onClick={(e) => handleNavClick(e, "faq")}
                className="text-sm font-semibold text-slate-705 hover:text-teal-605 py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-all"
              >
                Help & FAQ
              </a>
            </nav>
            
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
                <span>Get WhatsApp Quote</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEnquiry();
                }}
                className="flex items-center justify-center gap-2 bg-teal-600 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-teal-700 transition-all shadow-sm cursor-pointer"
              >
                <span>Enquire Now</span>
              </button>
            </div>
            
            <div className="pt-2 flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Authorized Local Partner
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
