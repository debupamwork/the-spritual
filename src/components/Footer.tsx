import React from "react";
import { Compass } from "lucide-react";

interface FooterProps {
  onOpenEnquiry: () => void;
  currentView: "home" | "booking" | "mybookings" | "profile" | "admin";
  setCurrentView: (view: "home" | "booking" | "mybookings" | "profile" | "admin") => void;
}

export default function Footer({ 
  onOpenEnquiry, 
  currentView, 
  setCurrentView 
}: FooterProps) {
  
  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookingLink = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentView("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminLink = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentView("admin");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHomeAnchorLink = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    const wasBookingView = currentView !== "home";
    setCurrentView("home");
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

  return (
    <footer className="bg-slate-900 text-slate-500 border-t border-slate-800 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="#" onClick={handleScrollToTop} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xs">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-white text-md font-bold tracking-tight">
              thespritual.in
            </span>
          </a>

          <div className="flex gap-4 text-xs font-semibold">
            <a 
              href="#online-booking" 
              onClick={handleBookingLink}
              className="hover:text-white text-teal-400 font-bold transition-colors"
            >
              Custom Enquiry
            </a>
            <a 
              href="#packages" 
              onClick={(e) => handleHomeAnchorLink(e, "packages")}
              className="hover:text-white transition-colors"
            >
              Our Packages
            </a>
            <a 
              href="#why-choose-us" 
              onClick={(e) => handleHomeAnchorLink(e, "why-choose-us")}
              className="hover:text-white transition-colors"
            >
              Why Us
            </a>
            <a 
              href="#admin-portal" 
              id="footer-operator-login"
              onClick={handleAdminLink}
              className="hover:text-teal-400 text-slate-600 transition-colors"
            >
              Operator Login
            </a>
          </div>
        </div>

        <hr className="border-slate-800/60 my-6" />

        <div className="text-center text-[10px] text-slate-650 leading-normal flex flex-col md:flex-row justify-between items-center gap-2">
          <span>© {new Date().getFullYear()} thespritual.in. Start directly from Guwahati, Assam. Certified Local Agency.</span>
          <button 
            onClick={handleAdminLink}
            id="quiet-operator-access"
            className="text-[9.5px] text-slate-700 hover:text-teal-500 font-bold transition-colors cursor-pointer bg-slate-950 px-2 py-1 rounded border border-slate-850"
          >
            Operator Control Board
          </button>
        </div>

      </div>
    </footer>
  );
}
