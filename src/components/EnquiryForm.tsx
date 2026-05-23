import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, MessageSquare, Clock, CreditCard, ShieldCheck, QrCode, ClipboardCheck, Landmark, Check, Calendar, ChevronLeft, ChevronRight, Lock, Sparkles, User, Copy, FileText, Smartphone, Ticket, AlertCircle } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

interface EnquiryFormProps {
  whatsappNumber: string;
  selectedPackageTitle: string;
}

export default function EnquiryForm({ whatsappNumber, selectedPackageTitle }: EnquiryFormProps) {
  const { packages, paymentGatewayEnabled, upiId, upiQrCode, razorpayEnabled, razorpayKeyId } = useSettings();

  // Find selected package or fallback
  const currentPackage = packages.find(p => p.title === selectedPackageTitle) || packages[0] || {
    id: "default-pkg",
    title: "Scenic Northeast Tour Course",
    duration: "4D / 3N",
    priceEstimate: "Rs. 9,999",
    description: "Tailored private cab tour starting from Guwahati."
  };

  // Ticket Code generator
  const [bookingRefId] = useState<string>(() => `NE-${Math.floor(1000000 + Math.random() * 9000000)}`);

  // Direct Booking state inputs
  const [customerName, setCustomerName] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(() => new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const [orderSummaryExpanded, setOrderSummaryExpanded] = useState(false);

  // Close calendar on selection or clicks outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatOrdinal = (day: number) => {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1:  return `${day}st`;
      case 2:  return `${day}nd`;
      case 3:  return `${day}rd`;
      default: return `${day}th`;
    }
  };

  const formatFullDate = (day: number, monthIndex: number, year: number) => {
    const dayStr = formatOrdinal(day);
    const monthName = MONTHS[monthIndex];
    return `${dayStr} ${monthName} ${year}`;
  };

  const handleDaySelect = (day: number) => {
    const selected = formatFullDate(day, currentCalendarDate.getMonth(), currentCalendarDate.getFullYear());
    setTravelDate(selected);
    setShowCalendar(false);
  };

  const handlePrevMonth = () => {
    setCurrentCalendarDate(prev => {
      const year = prev.getFullYear();
      const month = prev.getMonth();
      return new Date(year, month - 1, 1);
    });
  };

  const handleNextMonth = () => {
    setCurrentCalendarDate(prev => {
      const year = prev.getFullYear();
      const month = prev.getMonth();
      return new Date(year, month + 1, 1);
    });
  };
  const [peopleCount, setPeopleCount] = useState<number>(2);
  const [pickupPoint, setPickupPoint] = useState("Guwahati Airport (GAU)");
  
  // Custom Tiers
  const [accommodationLevel, setAccommodationLevel] = useState<"Standard" | "Comfort Deluxe" | "Premium Luxury">("Standard");
  const [vehiclePreference, setVehiclePreference] = useState("Standard Sedan");
  const [includeVipPass, setIncludeVipPass] = useState(false);
  const [customNotes, setCustomNotes] = useState("");

  // Stepper context: "form" | "checkout" | "success"
  const [checkoutStep, setCheckoutStep] = useState<"form" | "checkout" | "success">("form");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "CASH">("UPI");
  
  // Payment states
  const [upiRefNumber, setUpiRefNumber] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Card parameters
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Parse numerical estimate
  const getBasePriceNum = (str: string) => {
    const digits = str.replace(/[^0-9]/g, "");
    const parsed = parseInt(digits);
    return isNaN(parsed) ? 8999 : parsed;
  };

  const baseRate = getBasePriceNum(currentPackage.priceEstimate);

  // Live calculator calculation
  const calculateCosts = () => {
    let pricePerPerson = baseRate;

    // Accommodation Tier add-ons
    if (accommodationLevel === "Comfort Deluxe") {
      pricePerPerson += 1500;
    } else if (accommodationLevel === "Premium Luxury") {
      pricePerPerson += 4500;
    }

    let subTotal = pricePerPerson * peopleCount;

    // Vehicle Tiers flat fare
    if (vehiclePreference === "Premium Innova Crysta") {
      subTotal += 3500;
    } else if (vehiclePreference === "Luxury SUV/Audi") {
      subTotal += 8500;
    }

    // VIP temple pass register add-ons
    if (includeVipPass) {
      subTotal += 1000 * peopleCount;
    }

    return subTotal;
  };

  const finalCostAmount = calculateCosts();

  // Handle Copy VPA
  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Generate real dynamic paytm / phonepe UPI URL structure
  const getUpiString = () => {
    const amount = finalCostAmount;
    const payeeName = "thespritual.in Operator";
    const transactionId = `${bookingRefId}`;
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&tr=${transactionId}&tn=Tour-${encodeURIComponent(currentPackage.title.substring(0,15))}&cu=INR`;
  };

  const generatedQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(getUpiString())}`;

  // Form Submit validation
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerWhatsapp) {
      alert("Please enter both Name and WhatsApp number to create your workspace block.");
      return;
    }
    setCheckoutStep("checkout");
  };

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError("");

    if (paymentMethod === "UPI" && !upiRefNumber) {
      setPaymentError("Kindly enter the 12-digit UPI UTR Transaction Reference ID for immediate clearance.");
      return;
    }
    if (paymentMethod === "CARD" && (!cardNumber || !cardExpiry || !cardCvv)) {
      setPaymentError("Please provide all card details.");
      return;
    }

    setIsProcessingPayment(true);

    // Simulated modern payment verification step
    setTimeout(() => {
      setIsProcessingPayment(false);
      try {
        const orderRecord = {
          id: bookingRefId,
          customerName,
          customerWhatsapp,
          customerEmail: customerEmail || "direct-checkout@guest.com",
          packageId: currentPackage.id,
          packageName: currentPackage.title,
          duration: currentPackage.duration,
          travelDate: travelDate || "Flexible Slots",
          peopleCount,
          pickupPoint,
          budgetLevel: accommodationLevel,
          includeVipPass,
          vipPassCount: includeVipPass ? peopleCount : 0,
          vehicleType: vehiclePreference,
          totalPrice: finalCostAmount,
          paymentStatus: paymentMethod === "CASH" ? "Cash on Arrival Authorized" : "Paid Online (100%)",
          paymentMethod: paymentMethod === "UPI" ? "UPI Instant Scan" : paymentMethod === "CARD" ? "Credit Card API" : "Cash on Spot Authorization",
          status: "Confirmed (Automation Pending)",
          vibrancyCode: Math.floor(1000 + Math.random() * 9000).toString(),
          timestamp: new Date().toISOString()
        };

        // Cache order local
        const savedBookingsStr = localStorage.getItem("northeast_booking_orders") || "[]";
        const savedBookings = JSON.parse(savedBookingsStr);
        savedBookings.push(orderRecord);
        localStorage.setItem("northeast_booking_orders", JSON.stringify(savedBookings));

        // Save also under leads for backward compatibility
        const savedLeadsStr = localStorage.getItem("meghalaya_leads") || "[]";
        const savedLeads = JSON.parse(savedLeadsStr);
        savedLeads.push({
          name: customerName,
          whatsapp: customerWhatsapp,
          travelDate,
          peopleCount: peopleCount.toString(),
          pickupPoint,
          budgetRange: `${accommodationLevel} Checkout (INR ${finalCostAmount})`,
          message: `Booking Ref: ${bookingRefId}. Paid via ${paymentMethod}. Upgrades: ${vehiclePreference}. notes: ${customNotes}`
        });
        localStorage.setItem("meghalaya_leads", JSON.stringify(savedLeads));

        setCheckoutStep("success");
      } catch (err) {
        setPaymentError("Failed to store booking reservation records. Try again.");
      }
    }, 1500);
  };

  const getWhatsAppReceiptString = () => {
    const textDesc = `Hi Team, I just booked our trip!
*Booking Reference ID*: ${bookingRefId}
*Package*: ${currentPackage.title} (${currentPackage.duration})
*Lead Name*: ${customerName}
*Phone*: ${customerWhatsapp}
*Travel Date*: ${travelDate || "Flexible"}
*Adults*: ${peopleCount}
*Accommodations*: ${accommodationLevel}
*Vehicle*: ${vehiclePreference}
*Add-on*: ${includeVipPass ? "VIP Shrine Entrance passes registered" : "None"}
*Amount*: Rs. ${finalCostAmount.toLocaleString("en-IN")} (100% Fully Paid)
*Status*: Fully Paid Online (${paymentMethod})`;

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(textDesc)}`;
  };

  return (
    <div className="w-full relative z-10 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Booking Details Stepper */}
        <div className={`border border-slate-200 rounded-3xl bg-white shadow-sm p-6 sm:p-8 text-left flex flex-col justify-between ${
          checkoutStep === "form" ? "lg:col-span-8" : "lg:col-span-12 max-w-5xl mx-auto w-full"
        }`}>
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Direct Checkout Terminal</h4>
                <p className="text-[10px] text-slate-400">Complete instant secure 100% payment checkout</p>
              </div>
            </div>

            {/* Step Content: Step 1 Form */}
            {checkoutStep === "form" && (
              <form id="enquiry-booking-form" onSubmit={handleProceedToPayment} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amit Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs text-slate-900 border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-3 focus:outline-none focus:border-teal-500 focus:bg-white font-medium transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={customerWhatsapp}
                      onChange={(e) => setCustomerWhatsapp(e.target.value)}
                      className="w-full text-xs text-slate-900 border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-3 focus:outline-none focus:border-teal-500 focus:bg-white font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. amit@mail.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full text-xs text-slate-900 border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-3 focus:outline-none focus:border-teal-500 focus:bg-white font-medium transition-all"
                    />
                  </div>

                  <div className="space-y-1 relative" ref={calendarRef}>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Planned Travel Date *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        readOnly
                        placeholder="e.g. 15th October 2026"
                        value={travelDate}
                        onFocus={() => setShowCalendar(true)}
                        onClick={() => setShowCalendar(true)}
                        className="w-full text-xs text-slate-900 border border-slate-200 bg-slate-50/50 rounded-xl pl-3.5 pr-10 py-3 focus:outline-none focus:border-teal-500 focus:bg-white font-medium transition-all cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    </div>

                    {showCalendar && (
                      <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200 w-full sm:w-[280px] min-w-[260px]">
                        <div className="flex items-center justify-between mb-3">
                          <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-bold text-slate-800">
                            {MONTHS[currentCalendarDate.getMonth()]} {currentCalendarDate.getFullYear()}
                          </span>
                          <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Weeks grid header */}
                        <div className="grid grid-cols-7 text-center gap-1 mb-1">
                          {DAYS_OF_WEEK.map((day) => (
                            <div key={day} className="text-[10px] font-bold text-slate-400">
                              {day}
                            </div>
                          ))}
                        </div>

                        {/* Days numbers */}
                        <div className="grid grid-cols-7 gap-1 text-center font-sans text-xs">
                          {Array.from({ length: getFirstDayOfMonth(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth()) }).map((_, idx) => (
                            <div key={`empty-${idx}`} />
                          ))}
                          {Array.from({ length: getDaysInMonth(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth()) }).map((_, idx) => {
                            const dayNum = idx + 1;
                            const isToday = new Date().toDateString() === new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), dayNum).toDateString();
                            const isSelected = travelDate === formatFullDate(dayNum, currentCalendarDate.getMonth(), currentCalendarDate.getFullYear());
                            
                            return (
                              <button
                                key={dayNum}
                                type="button"
                                onClick={() => handleDaySelect(dayNum)}
                                className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                                  isSelected
                                    ? "bg-teal-600 text-white shadow-sm"
                                    : isToday
                                    ? "border border-teal-500 text-teal-600 font-bold bg-teal-50/50"
                                    : "text-slate-700 hover:bg-slate-100"
                                }`}
                              >
                                {dayNum}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Number of Travelers</label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                        className="px-3.5 py-2.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-l-xl text-slate-600 font-bold text-xs"
                      >
                        -
                      </button>
                      <div className="flex-grow text-center py-2.5 bg-slate-50 border-y border-slate-200 text-slate-900 font-bold text-xs font-mono">
                        {peopleCount} Adults
                      </div>
                      <button
                        type="button"
                        onClick={() => setPeopleCount(peopleCount + 1)}
                        className="px-3.5 py-2.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-r-xl text-slate-600 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Pickup Point</label>
                    <select
                      value={pickupPoint}
                      onChange={(e) => setPickupPoint(e.target.value)}
                      className="w-full text-xs text-slate-900 bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-3 focus:outline-none focus:border-teal-500 focus:bg-white font-medium"
                    >
                      <option value="Guwahati Airport (GAU)">Guwahati Airport (GAU)</option>
                      <option value="Guwahati Railway Station (GHY)">Guwahati Railway Station (GHY)</option>
                      <option value="Shillong Transit Point">Shillong Transit Point</option>
                    </select>
                  </div>
                </div>
              </form>
            )}

            {/* Step Content: Step 2 Checkout Selection */}
            {checkoutStep === "checkout" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
                {/* LEFT COLUMN: Passenger Boarding Pass & Invoice Breakdown (Span 5) */}
                <div className="md:col-span-5 space-y-6">
                  {/* The Passenger Pass */}
                  <div className="border border-slate-200 rounded-2xl bg-slate-950 text-white shadow-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 -z-10" />
                    {/* Top ticket strip */}
                    <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase">GROUND PASSAGE VOUCHER</span>
                      </div>
                      <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold">
                        {bookingRefId}
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Passenger info */}
                      <div className="space-y-1 text-left">
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">Main Passenger</span>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-sm font-black text-white">{customerName}</span>
                        </div>
                      </div>

                      {/* Itinerary details */}
                      <div className="space-y-1 text-left border-t border-slate-800/60 pt-3">
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">Selected Itinerary Course</span>
                        <div className="text-xs font-bold text-teal-300 leading-tight">
                          {currentPackage.title}
                        </div>
                        <span className="inline-block bg-teal-500/10 text-teal-300 text-[9px] px-2 py-0.5 rounded font-bold font-mono mt-1">
                          {currentPackage.duration} Custom Plan
                        </span>
                      </div>

                      {/* Travel details grid */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3 border-t border-slate-800/60 text-left text-[11px]">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase font-bold block">Travel Date</span>
                          <span className="font-semibold text-slate-300">{travelDate || "Flexible Departure"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase font-bold block">Group Size</span>
                          <span className="font-semibold text-slate-300">{peopleCount} {peopleCount === 1 ? "Adult" : "Adults"}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[9px] text-slate-500 uppercase font-bold block">Pickup Point Coordinate</span>
                          <span className="font-semibold text-slate-300 leading-tight block">{pickupPoint || "Guwahati Airport (GAU)"}</span>
                        </div>
                      </div>

                      {/* Custom Upgrades selected */}
                      <div className="pt-3 border-t border-slate-800/60 space-y-1.5 text-left text-[11px] text-slate-400">
                        <span className="text-[9px] text-slate-500 uppercase font-bold block">Upgraded Tiers</span>
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>Hotel Selection: <strong className="text-white font-medium">{accommodationLevel}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>Vehicle Fleet: <strong className="text-white font-medium">{vehiclePreference}</strong></span>
                        </div>
                        {includeVipPass && (
                          <div className="flex items-center gap-1.5 text-teal-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
                            <span>Maa Kamakhya Temple VIP passes included</span>
                          </div>
                        )}
                      </div>

                      {/* Ticket footer barcode decoration */}
                      <div className="pt-4 border-t border-dashed border-slate-850 flex flex-col items-center justify-center space-y-2">
                        <div className="w-full h-8 flex items-center justify-between overflow-hidden opacity-25 px-1 bg-slate-900/50 py-1 rounded">
                          {Array.from({ length: 35 }).map((_, i) => (
                            <div
                              key={i}
                              className="bg-white h-full"
                              style={{ width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 1 : 4)}px` }}
                            />
                          ))}
                        </div>
                        <span className="text-[8px] font-mono tracking-widest text-slate-600 block">ENCRYPTION TOKEN ASSIGNED AUTOMATICALLY</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Invoice breakdown */}
                  <div className="border border-slate-200 rounded-2xl bg-white p-5 text-left space-y-3.5 shadow-xs">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-500" /> Service Invoice breakdown
                    </span>
                    
                    <div className="space-y-2 text-xs font-sans">
                      <div className="flex justify-between items-center text-slate-500 font-medium font-sans">
                        <span>Base Price Fare ({peopleCount} head)</span>
                        <span>Rs. {(baseRate * peopleCount).toLocaleString("en-IN")}</span>
                      </div>

                      {accommodationLevel !== "Standard" && (
                        <div className="flex justify-between items-center text-slate-500 font-medium">
                          <span>Luxury Stay ({accommodationLevel})</span>
                          <span>Rs. {((accommodationLevel === "Comfort Deluxe" ? 1500 : 4500) * peopleCount).toLocaleString("en-IN")}</span>
                        </div>
                      )}

                      {vehiclePreference !== "Standard Sedan" && (
                        <div className="flex justify-between items-center text-slate-500 font-medium">
                          <span>Direct Cab Upgrade ({vehiclePreference})</span>
                          <span>Rs. {(vehiclePreference === "Premium Innova Crysta" ? 3500 : 8500).toLocaleString("en-IN")}</span>
                        </div>
                      )}

                      {includeVipPass && (
                        <div className="flex justify-between items-center text-slate-500 font-medium">
                          <span>VIP Temple Special Service</span>
                          <span>Rs. {(1000 * peopleCount).toLocaleString("en-IN")}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center border-t border-dashed border-slate-200 pt-2 font-black text-slate-900 text-sm">
                        <span>Total Checkout Fare</span>
                        <span className="text-teal-650">Rs. {finalCostAmount.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Terminal Input Deck (Span 7) */}
                <div className="md:col-span-7 space-y-6">
                  {paymentGatewayEnabled ? (
                    <div className="space-y-5">
                      <div className="text-left">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                          <Lock className="w-3 h-3 text-emerald-500" /> Secure Terminal Portal
                        </span>
                        <span className="text-xs text-slate-500 block mt-1">Select your secure option to authorize bookings instantly:</span>
                      </div>

                      {/* Tech Payment Toggles */}
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => { setPaymentMethod("UPI"); setPaymentError(""); }}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between h-[105px] ${
                            paymentMethod === "UPI"
                              ? "border-emerald-600 bg-emerald-5/20 text-emerald-950 shadow-sm ring-2 ring-emerald-500/20"
                              : "border-slate-200 hover:border-slate-350 bg-white text-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <QrCode className={`w-5 h-5 ${paymentMethod === "UPI" ? "text-emerald-600" : "text-slate-400"}`} />
                            <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${paymentMethod === "UPI" ? "bg-emerald-100/60 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>UPI QR</span>
                          </div>
                          <div>
                            <span className="text-xs font-black block leading-none">Instant Scan Code</span>
                            <span className="text-[9.5px] text-slate-400 block mt-1 leading-tight font-medium">Clearance in 10s</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => { setPaymentMethod("CARD"); setPaymentError(""); }}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between h-[105px] ${
                            paymentMethod === "CARD"
                              ? "border-emerald-600 bg-emerald-5/20 text-emerald-950 shadow-sm ring-2 ring-emerald-500/20"
                              : "border-slate-200 hover:border-slate-355 bg-white text-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <CreditCard className={`w-5 h-5 ${paymentMethod === "CARD" ? "text-emerald-600" : "text-slate-400"}`} />
                            <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${paymentMethod === "CARD" ? "bg-emerald-100/60 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>CARD SECURE</span>
                          </div>
                          <div>
                            <span className="text-xs font-black block leading-none">Credit / Debit Card</span>
                            <span className="text-[9.5px] text-slate-400 block mt-1 leading-tight font-medium">SSL Encrypted Route</span>
                          </div>
                        </button>
                      </div>

                      {/* Method details: UPI scan QR code code */}
                      {paymentMethod === "UPI" && (
                        <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 text-left space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <div className="space-y-1">
                            <h5 className="text-xs font-extrabold text-slate-900 block flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> 1. Scan & Send Booking Amount
                            </h5>
                            <p className="text-[10.5px] text-slate-500 leading-relaxed">
                              Open GPay, PhonePe, Paytm or similar app. Scan the dynamic QR below to clear standard registration fees of <strong className="text-slate-900 font-extrabold text-xs">Rs. {finalCostAmount.toLocaleString("en-IN")}</strong>.
                            </p>
                          </div>

                          {/* QR Image Visual Frame */}
                          <div className="flex justify-center p-1">
                            <div className="relative p-5 bg-white rounded-2xl border border-slate-200/80 shadow-inner flex items-center justify-center">
                              {/* Corner photo targeting guides */}
                              <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-slate-800 rounded-tl-sm pointer-events-none" />
                              <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-slate-800 rounded-tr-sm pointer-events-none" />
                              <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-slate-800 rounded-bl-sm pointer-events-none" />
                              <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-slate-800 rounded-br-sm pointer-events-none" />
                              <img
                                src={upiQrCode || generatedQrUrl}
                                alt="Payment scan QR locator"
                                className="w-36 h-36 object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </div>

                          {/* VPA copy block helper */}
                          <div className="space-y-1.5 pt-1.5 border-t border-slate-200/50">
                            <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wide">Or transfer to direct VPA address</span>
                            <div className="flex bg-white rounded-xl border border-slate-200 overflow-hidden text-xs max-w-sm">
                              <span className="flex-grow px-3 py-2 text-slate-700 font-mono text-left truncate">{upiId}</span>
                              <button
                                type="button"
                                onClick={copyToClipboard}
                                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10.5px] flex items-center gap-1 transition-colors outline-none shrink-0 cursor-pointer"
                              >
                                {copiedUpi ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 text-slate-300" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Receipt 12-digit ref box */}
                          <div className="space-y-1.5 pt-3 border-t border-slate-200/50">
                            <label className="text-[10px] font-black uppercase text-slate-400 block tracking-wide font-sans">
                              2. Paste 12-Digit UPI UTR Transaction ID *
                            </label>
                            <input
                              type="text"
                              maxLength={16}
                              required
                              placeholder="e.g. 562104928154"
                              value={upiRefNumber}
                              onChange={(e) => setUpiRefNumber(e.target.value)}
                              className="w-full text-xs text-slate-900 border border-slate-300 bg-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono tracking-widest text-center text-sm font-bold"
                            />
                            <p className="text-[9px] text-slate-400 leading-normal">
                              Verify on your banking app or ledger statement after payment completion. Match occurs in real-time.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Method details: Card secure inputs */}
                      {paymentMethod === "CARD" && (
                        <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 text-left space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 font-sans">
                          <div className="space-y-1">
                            <h5 className="text-xs font-extrabold text-slate-900 block flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Direct SSL Card Authorization
                            </h5>
                            <p className="text-[10.5px] text-slate-500 leading-relaxed">
                              Securely submit credit or debit parameters. Authentication processes over tokenized protocols.
                            </p>
                          </div>

                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider">Cardholder Name</label>
                              <input
                                type="text"
                                placeholder="Amit Sharma"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                className="w-full text-xs text-slate-900 border border-slate-200 bg-white rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider">Secure Card Number</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="xxxx xxxx xxxx xxxx"
                                  value={cardNumber}
                                  onChange={(e) => setCardNumber(e.target.value)}
                                  className="w-full text-xs text-slate-900 border border-slate-200 bg-white rounded-xl pl-3.5 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono tracking-widest font-black"
                                />
                                <CreditCard className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider">Expiry (MM / YY)</label>
                                <input
                                  type="text"
                                  placeholder="12/28"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  className="w-full text-xs text-slate-900 border border-slate-200 bg-white rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono font-bold text-center"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider">CVV Code</label>
                                <input
                                  type="password"
                                  maxLength={3}
                                  placeholder="***"
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value)}
                                  className="w-full text-xs text-slate-900 border border-slate-200 bg-white rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-center font-black animate-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Gateway is offline/disabled fallback
                    <div className="p-5 bg-sky-50 rounded-2xl border border-sky-100 space-y-3.5 text-left animate-in fade-in duration-200">
                      <div className="flex items-center gap-1.5 text-sky-900">
                        <Landmark className="w-4 h-4 text-sky-700 shrink-0" />
                        <span className="text-xs font-black uppercase tracking-wider block">Prepayment Waived (Offline Booking Active)</span>
                      </div>
                      <p className="text-[11px] text-sky-700 leading-relaxed font-sans">
                        Our merchant gateway is currently executing maintenance checks. You can book your tour slot now and settle payment with <strong>Cash or Instant UPI upon arrival</strong>. No initial reservation deposit required today.
                      </p>
                      <div className="p-3 bg-white/60 border border-sky-150 rounded-xl flex items-start gap-2 text-[10.5px] font-bold text-sky-900 leading-normal">
                        <Check className="w-3.5 h-3.5 text-sky-705 shrink-0 mt-0.5" />
                        <span>Instant reservation verified automatically by the transport desks.</span>
                      </div>
                    </div>
                  )}

                  {/* Payment errors display */}
                  {paymentError && (
                    <div className="p-3.5 bg-red-50 rounded-xl border border-red-100 flex items-start gap-2 text-red-700 text-xs font-bold leading-normal text-left animate-shake">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{paymentError}</span>
                    </div>
                  )}

                  {/* Submission deck CTAs */}
                  <div className="space-y-4 pt-2">
                    <button
                      onClick={handleCompleteBooking}
                      disabled={isProcessingPayment}
                      className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-65 text-white font-extrabold py-4 px-6 rounded-2xl text-xs transition-all cursor-pointer shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 active:scale-98 text-left"
                    >
                      {isProcessingPayment ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin inline-block shrink-0" />
                          <span>Generating Secure Passage Voucher...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{paymentGatewayEnabled ? "Confirm Payment & Settle Booking" : "Complete Booking Placement"}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setCheckoutStep("form")}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest cursor-pointer mt-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Back to selection customized details</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step Content: Step 3 Success Voucher Sheet */}
            {checkoutStep === "success" && (
              <div className="text-center py-6 space-y-5 animate-in fade-in duration-300">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                  <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-lg font-extrabold text-slate-900">Direct Booking Succeeded!</h4>
                  <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                    Your personal travel itinerary and Guwahati cab slot are authorized. A designated live trip coordinator will reach out to schedule driver contacts.
                  </p>
                </div>

                {/* Simple dynamic Ticket Voucher sheet */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left space-y-3.5 max-w-md mx-auto relative overflow-hidden font-mono">
                  <div className="absolute top-0 right-0 bg-teal-605 text-white text-[8px] px-3.5 py-1 rounded-bl-xl uppercase font-black tracking-widest leading-none">Ticket</div>
                  <h5 className="text-[10.5px] uppercase font-black text-slate-400 leading-none">Northeast Express Passage</h5>

                  <div className="grid grid-cols-2 gap-2 text-[11px] leading-tight">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Passenger</span>
                      <strong className="text-slate-800 text-xs font-bold">{customerName}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Booking ID</span>
                      <strong className="text-slate-800 text-xs font-bold font-mono">{bookingRefId}</strong>
                    </div>

                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[9px] uppercase">Route Package</span>
                      <strong className="text-slate-800 font-bold">{currentPackage.title}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Pickup Point</span>
                      <span className="text-slate-700 font-bold">{pickupPoint}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Travel Date</span>
                      <span className="text-slate-700 font-bold">{travelDate}</span>
                    </div>

                    <div className="border-t border-dashed border-slate-250 col-span-2 pt-2 flex items-baseline justify-between font-sans">
                      <span className="text-[10px] text-slate-400 uppercase font-black block">Standard Total Cost</span>
                      <span className="text-sm font-black text-teal-700">Rs. {finalCostAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Actions below receipt */}
                <div className="flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto pt-2">
                  <a
                    href={getWhatsAppReceiptString()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-grow inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer shadow-md shadow-emerald-500/10"
                  >
                    <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
                    <span>Confirm Booking on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      setCheckoutStep("form");
                      setCustomerName("");
                      setCustomerWhatsapp("");
                      setCustomerEmail("");
                      setTravelDate("");
                      setPeopleCount(2);
                      setUpiRefNumber("");
                    }}
                    className="bg-white hover:bg-slate-100 text-slate-500 font-bold py-3 px-4 rounded-xl border border-slate-200 text-xs shrink-0"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Guidelines Footer */}
          {checkoutStep !== "success" && (
            <div className="border-t border-slate-100 pt-3.5 mt-6 text-left">
              <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider block">Security Assured matrices</span>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                Direct booking slot is secured inside Guwahati Transport databases with 256-bit SSL gateway standards. No automated card parameters are stored locally.
              </p>
            </div>
          )}

        </div>

        {/* Right Side: Order Summary & Interactive pricing live calculator */}
        {checkoutStep === "form" && (
          <div className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col justify-between border border-slate-200 rounded-3xl bg-white shadow-sm p-6 sm:p-8 text-left animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Order Summary</span>
              <div className="mt-3 space-y-2">
                <span className="text-[10px] text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md font-extrabold uppercase tracking-wide inline-block leading-none">
                  {currentPackage.duration} Plan
                </span>
                <h4 className="text-sm font-extrabold tracking-tight text-slate-900 leading-tight">
                  {currentPackage.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  {currentPackage.description}
                </p>
              </div>
  
               {/* Calculations Breakdown list */}
               <div className="mt-5 space-y-2 text-xs font-sans">
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">Service cost breakdown</span>
                 
                 <div className="flex justify-between items-center text-slate-500 font-medium">
                   <span>Base Fare ({peopleCount} head)</span>
                   <span>Rs. {(baseRate * peopleCount).toLocaleString("en-IN")}</span>
                 </div>

                 {accommodationLevel !== "Standard" && (
                   <div className="flex justify-between items-center text-slate-500 font-medium">
                     <span>Hotel Upgrade ({accommodationLevel})</span>
                     <span>Rs. {((accommodationLevel === "Comfort Deluxe" ? 1500 : 4500) * peopleCount).toLocaleString("en-IN")}</span>
                   </div>
                 )}

                 {vehiclePreference !== "Standard Sedan" && (
                   <div className="flex justify-between items-center text-slate-500 font-medium">
                     <span>Cab Upgrade ({vehiclePreference})</span>
                     <span>Rs. {(vehiclePreference === "Premium Innova Crysta" ? 3500 : 8500).toLocaleString("en-IN")}</span>
                   </div>
                 )}

                 {includeVipPass && (
                   <div className="flex justify-between items-center text-slate-500 font-medium">
                     <span>VIP Temple Pass Add-on</span>
                     <span>Rs. {(1000 * peopleCount).toLocaleString("en-IN")}</span>
                   </div>
                 )}
               </div>
            </div>
  
            <div className="pt-4 mt-6 sm:mt-0 space-y-4">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-slate-800 text-xs font-bold uppercase tracking-wide">Gross Calculated Cost</span>
                <span className="text-xl font-black text-slate-900">Rs. {finalCostAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-100/50 rounded-xl flex items-start gap-2 text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-[10px] font-medium leading-relaxed font-sans text-left">
                  <strong>Secure 100% Full Payment</strong>: Paying the full amount of <strong>Rs. {finalCostAmount.toLocaleString("en-IN")}</strong> secures this complete car, driver, and hotel reservation today. Zero hidden charges or outstanding fares model active.
                </div>
              </div>
  
              {checkoutStep === "form" && (
                <button
                  type="submit"
                  form="enquiry-booking-form"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-slate-900/10 flex items-center justify-center gap-1.5"
                >
                  <span>Proceed to Payment</span>
                  <span>&rarr;</span>
                </button>
              )}
            </div>
  
          </div>
        )}
      </div>
    </div>
  );
}
