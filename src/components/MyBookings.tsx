import React, { useState, useEffect } from "react";
import { 
  Calendar, Ticket, MapPin, Sparkles, Phone, Compass, Ship, 
  Clock, CreditCard, ChevronRight, Share2, Clipboard, User,
  CheckCircle, ShieldAlert, ArrowLeft, Download, ExternalLink, RefreshCw
} from "lucide-react";
import { OnlineBooking } from "../types";

interface MyBookingsProps {
  onStartBooking: () => void;
  whatsappNumber: string;
}

export default function MyBookings({ onStartBooking, whatsappNumber }: MyBookingsProps) {
  const [bookings, setBookings] = useState<OnlineBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<OnlineBooking | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load bookings from localStorage
  const loadBookings = () => {
    const saved = localStorage.getItem("northeast_booking_orders") || "[]";
    try {
      const parsed = JSON.parse(saved) as OnlineBooking[];
      // Sort with latest first
      parsed.sort((a, b) => new Date(b.timestamp || "").getTime() - new Date(a.timestamp || "").getTime());
      setBookings(parsed);
      if (parsed.length > 0 && !selectedBooking) {
        setSelectedBooking(parsed[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const copyRefNumber = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter bookings based on active vs completed/historic dates
  const filteredBookings = bookings.filter(b => {
    const travelDate = new Date(b.travelDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    if (activeTab === "active") {
      return travelDate >= today;
    } else {
      return travelDate < today;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed (Automation Pending)":
        return "bg-emerald-50 text-emerald-800 border-emerald-100";
      case "VIP Temple Passes Registered":
        return "bg-sky-50 text-sky-800 border-sky-100";
      case "Mountain Resort Booked":
        return "bg-amber-50 text-amber-800 border-amber-100";
      case "High-End SUV & Driver Assigned":
        return "bg-purple-50 text-purple-800 border-purple-100";
      default:
        return "bg-teal-50 text-teal-800 border-teal-100";
    }
  };

  // Generate support WhatsApp href
  const getSupportLink = (booking: OnlineBooking) => {
    const msg = `Hi Support, I'd like to check the status or update my Northeast booking. Ref Code: ${booking.id}. Name: ${booking.customerName}. Package: ${booking.packageName}.`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-6 text-left">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Ticket className="w-6 h-6 text-teal-600" />
            My Tour Bookings & Passes
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Track your scheduled private car, certified driver clearances, hotel check-ins, and shrine entry tickets.
          </p>
        </div>

        <button
          onClick={loadBookings}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-teal-600 border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-sync Live Data
        </button>
      </div>

      {bookings.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-14 text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mx-auto border border-teal-100">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-slate-900">No active bookings found locally</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Ready to explore Meghalaya, Cherrapunji, Shillong, or Kaziranga National Park? Create a customized private car trip with live tracking.
            </p>
          </div>

          <button
            onClick={onStartBooking}
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-md cursor-pointer transition-all"
          >
            Create Your Custom Northeast Plan Now
          </button>
        </div>
      ) : (
        /* Content Multi-Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Bookings list */}
          <div className="lg:col-span-5 space-y-4">
            {/* Tabs toggle */}
            <div className="bg-slate-100/80 p-1 rounded-xl flex items-center gap-1 border border-slate-250/20">
              <button
                onClick={() => setActiveTab("active")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold text-center transition-all cursor-pointer ${
                  activeTab === "active" 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Upcoming Holidays ({bookings.filter(b => new Date(b.travelDate).getTime() >= new Date().setHours(0,0,0,0)).length})
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold text-center transition-all cursor-pointer ${
                  activeTab === "completed" 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Past Memories ({bookings.filter(b => new Date(b.travelDate).getTime() < new Date().setHours(0,0,0,0)).length})
              </button>
            </div>

            {/* List entries */}
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredBookings.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl py-8 text-center text-xs text-slate-400 font-medium">
                  No bookings found under this timeline.
                </div>
              ) : (
                filteredBookings.map((b) => {
                  const isActive = selectedBooking?.id === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        isActive 
                          ? "border-teal-500 bg-teal-50/20 shadow-md ring-1 ring-teal-500" 
                          : "border-slate-200/80 bg-white hover:border-slate-350 hover:shadow-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-black font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {b.id}
                        </span>
                        <span className="text-[9.5px] text-slate-400 font-bold">
                          {new Date(b.timestamp || b.travelDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </span>
                      </div>

                      <h4 className="text-xs font-extrabold text-slate-900 tracking-tight truncate">
                        {b.packageName}
                      </h4>

                      <div className="flex items-center gap-2 mt-2 text-[10.5px] text-slate-500 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <span>Date: {new Date(b.travelDate).toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</span>
                      </div>

                      <div className="flex items-center justify-between gap-1 mt-4 pt-3 border-t border-slate-100">
                        <span className="text-[10px] font-black text-slate-900">
                          Rs. {b.totalPrice ? b.totalPrice.toLocaleString("en-IN") : "N/A"}
                        </span>
                        <span className={`text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusColor(b.status)}`}>
                          {b.status.replace(" (Automation Pending)", "")}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Selected booking voucher detail card */}
          <div className="lg:col-span-7">
            {selectedBooking ? (
              <div className="bg-white border border-slate-200 rounded-3xl shadow-md overflow-hidden relative">
                {/* Visual Top Highlight bar */}
                <div className="h-2 bg-gradient-to-r from-teal-500 to-emerald-600" />

                {/* Voucher Core Header */}
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-slate-50/45">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded border border-emerald-100">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> Guaranteed Active Booking
                    </span>
                    <h3 className="text-base font-black text-slate-900 tracking-tight mt-1.5">
                      {selectedBooking.packageName}
                    </h3>
                    <div className="flex items-center gap-2.5 text-xs text-slate-500 font-bold mt-1">
                      <span>Package Duration: {selectedBooking.duration || "Northeast Tour Course"}</span>
                      <span>•</span>
                      <span>{selectedBooking.peopleCount} {selectedBooking.peopleCount === 1 ? 'Guest' : 'Guests'}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Unique Booking ID</span>
                    <button 
                      onClick={() => copyRefNumber(selectedBooking.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-black font-mono text-slate-900 hover:text-teal-600 mt-1 cursor-pointer"
                    >
                      {selectedBooking.id}
                      <Clipboard className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    {copiedId === selectedBooking.id && (
                      <span className="text-[9px] text-teal-600 font-black block mt-0.5">Copied to Clipboard!</span>
                    )}
                  </div>
                </div>

                {/* Details list */}
                <div className="p-6 space-y-6">
                  {/* Status Indicator Stepper */}
                  <div className="space-y-3.5">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Live Booking Manifest Status</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div className="p-3 rounded-xl border border-slate-150 bg-slate-50 space-y-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Core State</span>
                        <span className="text-xs font-black text-slate-800 block">
                          {selectedBooking.status}
                        </span>
                      </div>
                      
                      <div className="p-3 rounded-xl border border-slate-150 bg-slate-50 space-y-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Authorization Status</span>
                        <span className="text-xs font-black text-teal-700 block flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-teal-600" />
                          {selectedBooking.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Traveler Config Recap */}
                  <div className="border-t border-slate-100 pt-5 space-y-4">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Journey Itinerary Logistics</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs text-slate-600 font-medium font-sans">
                      <div className="space-y-1">
                        <span className="text-slate-400 block">Passenger / Lead Name:</span>
                        <span className="font-extrabold text-slate-900 block flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-500" /> {selectedBooking.customerName}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-400 block">WhatsApp Phone Registered:</span>
                        <span className="font-extrabold text-slate-900 block flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-500" /> {selectedBooking.customerWhatsapp}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-400 block">Scheduled Start Date:</span>
                        <span className="font-extrabold text-slate-900 block flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-teal-600" /> 
                          {new Date(selectedBooking.travelDate).toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-400 block">Startup Pickup Point:</span>
                        <span className="font-extrabold text-slate-900 block flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-teal-600" /> {selectedBooking.pickupPoint}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-400 block">Private Transport Class:</span>
                        <span className="font-extrabold text-slate-900 block">
                          🏎️ {selectedBooking.vehicleType}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-400 block">Shrine VIP Entry:</span>
                        <span className="font-extrabold text-slate-900 block text-teal-700 font-bold">
                          {selectedBooking.includeVipPass ? `✅ Activated VIP tickets (~${selectedBooking.peopleCount} guests)` : "❌ Not Included"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Driver Assign Section */}
                  <div className="border-t border-slate-100 pt-5 bg-teal-50/20 p-4 rounded-2xl border border-teal-100/50 space-y-2">
                    <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider block">Assigned Certified Chauffeur / Local Guide</span>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-extrabold text-sm flex items-center justify-center">
                        {selectedBooking.driverName ? selectedBooking.driverName.charAt(0) : "D"}
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-black text-slate-900">{selectedBooking.driverName || "Assigning Certified Local Chauffeur Guidelines..."}</h4>
                        <p className="text-[10.5px] text-slate-500 font-medium">Verified local tour specialist / hills expert</p>
                        {selectedBooking.driverPhone && (
                          <span className="text-xs font-extrabold text-teal-700 block mt-1">📞 {selectedBooking.driverPhone}</span>
                        )}
                      </div>
                    </div>
                    {!selectedBooking.driverName && (
                      <p className="text-[10px] text-slate-400 leading-relaxed pt-1.5">
                        *Driver contact, license key & exact vehicle numbers are SMS dispatched 24 Hours prior to your arrival date at Guwahati airport/rail station.
                      </p>
                    )}
                  </div>

                  {/* Active ticket QR Voucher mockup rendering */}
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-5 justify-between">
                    <div className="text-left space-y-1">
                      <span className="text-[9px] font-mono font-black uppercase text-slate-400 tracking-wider block">Authorized Digital Pass Key</span>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Authorized by thespritual.in. Scan QR directly at Guwahati Airport pickup lounge for instant private vehicle onboarding.
                      </p>
                      <span className="inline-block text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-700">
                        VIBE-ID: {selectedBooking.vibrancyCode || "9A48F"}
                      </span>
                    </div>

                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent("TheSpritualBooking:" + selectedBooking.id)}&color=0d9488`}
                      alt="onboard qr code verification" 
                      className="w-20 h-20 bg-white p-1 rounded-xl border border-slate-200 shrink-0"
                    />
                  </div>
                </div>

                {/* Actions Bottom Bar */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans">
                  <a
                    href={getSupportLink(selectedBooking)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer text-center transition-all flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp Travel Coordinator</span>
                  </a>

                  <button
                    onClick={() => window.print()}
                    className="w-full sm:w-auto bg-white border border-slate-200 hover:border-slate-350 text-slate-700 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print Booking Receipt</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/60 text-center text-xs text-slate-500 font-bold">
                Select a package booking to display printable boarding passes.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
