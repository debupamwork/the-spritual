import React, { useState } from "react";
import Header from "./components/Header";
import ImageCarousel from "./components/ImageCarousel";
import Packages from "./components/Packages";
import WhyChooseUs from "./components/WhyChooseUs";
import EnquiryForm from "./components/EnquiryForm";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import CTASection from "./components/CTASection";
import AdminPanel from "./components/AdminPanel";
import MyBookings from "./components/MyBookings";
import UserProfile from "./components/UserProfile";
import { SettingsProvider, useSettings } from "./context/SettingsContext";

function MainAppContent() {
  const [currentView, setCurrentView] = useState<"home" | "booking" | "mybookings" | "profile" | "admin">("home");
  const [selectedPackageTitle, setSelectedPackageTitle] = useState<string>("");
  const { whatsappNumber, promotionalOffer } = useSettings();

  const handleSelectPackage = (packageTitle: string) => {
    setSelectedPackageTitle(packageTitle);
    setCurrentView("booking");
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleOpenGeneralEnquiry = () => {
    setSelectedPackageTitle("General Northeast Itinerary Customization");
    setCurrentView("booking");
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative antialiased selection:bg-teal-500 selection:text-white">
      
      {/* Interactive Top Notification Banner */}
      {promotionalOffer && (
        <div className="bg-teal-900 text-white text-[10px] font-bold py-1.5 px-4 text-center z-50 flex items-center justify-center gap-1.5 relative border-b border-teal-950">
          <span>{promotionalOffer}</span>
          <button
            onClick={handleOpenGeneralEnquiry}
            className="underline text-teal-200 hover:text-white transition-colors cursor-pointer ml-1"
          >
            Verify Slots &rarr;
          </button>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        whatsappNumber={whatsappNumber}
        onOpenEnquiry={handleOpenGeneralEnquiry}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Main Sections */}
      <main className="flex-grow pb-24">
        
        {/* Render Admin Panel Mode */}
        {currentView === "admin" && (
          <div className="pt-24 pb-16 px-4 md:px-0">
            <div className="max-w-7xl mx-auto">
              {/* Back Link */}
              <div className="mb-6">
                <button
                  onClick={() => {
                    setCurrentView("home");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  &larr; Exit Admin & Goto Portal
                </button>
              </div>

              <AdminPanel onBack={() => setCurrentView("home")} />
            </div>
          </div>
        )}

        {/* Render Booking/Custom Enquiry Mode */}
        {currentView === "booking" && (
          <div className="bg-slate-50 min-h-screen py-24 sm:py-28 animate-in fade-in duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Back Button */}
              <div className="mb-6">
                <button
                  onClick={() => {
                    setCurrentView("home");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer self-start"
                >
                  &larr; View Scenic Packages
                </button>
              </div>

              {/* Render Enquiry Form */}
              <div className="animate-in fade-in duration-300">
                <EnquiryForm
                  whatsappNumber={whatsappNumber}
                  selectedPackageTitle={selectedPackageTitle}
                />
              </div>

            </div>
          </div>
        )}

        {/* Render User's Saved Bookings Mode */}
        {currentView === "mybookings" && (
          <div className="bg-slate-50 min-h-screen py-24 sm:py-28 animate-in fade-in duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <MyBookings 
                onStartBooking={() => {
                  setSelectedPackageTitle("General Northeast Itinerary Customization");
                  setCurrentView("booking");
                }}
                whatsappNumber={whatsappNumber}
              />
            </div>
          </div>
        )}

        {/* Render Personal Profile / Checklist Mode */}
        {currentView === "profile" && (
          <div className="bg-slate-50 min-h-screen py-24 sm:py-28 animate-in fade-in duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <UserProfile />
            </div>
          </div>
        )}

        {/* Render Standard Portal Landing Mode */}
        {currentView === "home" && (
          <div className="pt-0 animate-in fade-in duration-300">
            {/* Scenic Dynamic Banner Highlights */}
            <ImageCarousel onOpenEnquiry={handleOpenGeneralEnquiry} />

            {/* Heading Section: Visit */}
            <div className="text-center max-w-2xl mx-auto mt-12 mb-6 px-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-none mb-3">
                Most Popular Packages
              </h2>
            </div>

            {/* 1. Popular Packages */}
            <Packages
              onSelectPackage={handleSelectPackage}
              whatsappNumber={whatsappNumber}
            />

            {/* 2. Why Choose Us */}
            <WhyChooseUs
              onOpenEnquiry={handleOpenGeneralEnquiry}
            />

            {/* 3. Testimonials Section */}
            <Testimonials
              onOpenEnquiry={handleOpenGeneralEnquiry}
            />

            {/* 4. FAQ Section */}
            <FAQ
              onOpenEnquiry={handleOpenGeneralEnquiry}
            />

            {/* 5. Final CTA Section */}
            <CTASection
              whatsappNumber={whatsappNumber}
              onOpenEnquiry={handleOpenGeneralEnquiry}
            />
          </div>
        )}


      </main>

      {/* Footer Section */}
      <Footer 
        onOpenEnquiry={handleOpenGeneralEnquiry} 
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <MainAppContent />
    </SettingsProvider>
  );
}
