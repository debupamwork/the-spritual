import React from "react";
import { Car, Home, Compass, PhoneCall, Users, Shield, ShieldCheck } from "lucide-react";
import { benefitsList } from "../data";

interface WhyChooseUsProps {
  onOpenEnquiry: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Car: Car,
  Shield: Shield,
  Home: Home,
  Compass: Compass,
  PhoneCall: PhoneCall,
  Users: Users
};

export default function WhyChooseUs({ onOpenEnquiry }: WhyChooseUsProps) {
  return (
    <section id="why-choose-us" className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-emerald-700 font-extrabold uppercase tracking-wider text-[10px] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Why Choose Us
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Stress-Free Travel
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            No local taxi hunting or hidden tourist rates. We coordinate everything directly.
          </p>
        </div>

        {/* Custom Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefitsList.map((benefit, index) => {
            const IconComponent = iconMap[benefit.iconName] || Compass;
            return (
              <div key={index} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100/80 transition-all duration-350 flex gap-4 items-start">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 shrink-0 border border-teal-100">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">{benefit.title}</h3>
                  <p className="text-xs text-slate-500 leading-normal">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimalist Booking Bar replaced the huge black banner */}
        <div className="mt-12 bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            <div>
              <h3 className="text-lg font-bold">Ready to design your ideal Northeast itinerary?</h3>
              <p className="text-slate-400 text-xs mt-1">Get custom accommodation, VIP temple entry, and car pricing on your phone.</p>
            </div>
            <button
              onClick={onOpenEnquiry}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition-all text-xs cursor-pointer inline-flex items-center gap-1.5 focus:ring-2 focus:ring-teal-500"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Inquire Now</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
