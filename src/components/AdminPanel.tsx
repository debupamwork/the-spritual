import React, { useState, useRef } from "react";
import { useSettings, CarouselSlide } from "../context/SettingsContext";
import { PackageItem } from "../types";
import { 
  Lock, KeyRound, Save, RefreshCw, Plus, Trash2, Image, 
  Phone, Megaphone, HelpCircle, FileText, CheckCircle2, AlertCircle, 
  MapPin, Clock, PlusCircle, ArrowLeft, Heart, Sparkles, UploadCloud 
} from "lucide-react";

interface AdminPanelProps {
  onBack: () => void;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const { 
    whatsappNumber, 
    promotionalOffer, 
    carouselSlides, 
    packages, 
    adminPin, 
    isFirebaseActive,
    paymentGatewayEnabled,
    upiId,
    upiQrCode,
    razorpayEnabled,
    razorpayKeyId,
    marqueeText,
    saveSettings, 
    resetToDefaults 
  } = useSettings();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Admin Controls State
  const [localWhatsapp, setLocalWhatsapp] = useState(whatsappNumber);
  const [localPromo, setLocalPromo] = useState(promotionalOffer);
  const [localSlides, setLocalSlides] = useState<CarouselSlide[]>(carouselSlides);
  const [localPackages, setLocalPackages] = useState<PackageItem[]>(packages);
  const [localPin, setLocalPin] = useState(adminPin);

  // New Payment details states
  const [localPaymentGatewayEnabled, setLocalPaymentGatewayEnabled] = useState(paymentGatewayEnabled);
  const [localUpiId, setLocalUpiId] = useState(upiId);
  const [localUpiQrCode, setLocalUpiQrCode] = useState(upiQrCode);
  const [localRazorpayEnabled, setLocalRazorpayEnabled] = useState(razorpayEnabled);
  const [localRazorpayKeyId, setLocalRazorpayKeyId] = useState(razorpayKeyId);
  const [localMarqueeText, setLocalMarqueeText] = useState(marqueeText);

  // UI State
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "images" | "packages" | "bookings">("general");
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load submissions orders state
  const [bookingOrders, setBookingOrders] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("northeast_booking_orders") || "[]";
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  // Authentication logic
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === adminPin) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect security pincode. Access denied.");
    }
  };

  // Drag and Drop files handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showNotification("error", "Only image files (PNG, JPG, JPEG, WEBP) are supported.");
      return;
    }

    showNotification("success", "Compressing and optimizing banner image to fit cloud storage...");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          
          // HD landscape banner optimized ratios
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            saveSlideWithData(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          // Compressing at high-quality JPEG 0.75 gives incredible results under 80KB!
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
          saveSlideWithData(compressedBase64);
        } catch (err) {
          console.error("Canvas compression failed, falling back to original", err);
          saveSlideWithData(event.target?.result as string);
        }
      };
      img.onerror = () => {
        showNotification("error", "Error loading image resource for compression.");
      };
    };
    reader.onerror = () => {
      showNotification("error", "Error reading image file from source.");
    };

    const saveSlideWithData = (dataUrl: string) => {
      const newSlideId = localSlides.length > 0 ? Math.max(...localSlides.map(s => s.id)) + 1 : 1;
      const newSlide: CarouselSlide = {
        id: newSlideId,
        title: file.name.split(".")[0].replace(/_|-/g, " ").substring(0, 30),
        image: dataUrl
      };
      setLocalSlides([...localSlides, newSlide]);
      showNotification("success", `Successfully optimized and loaded banner: ${newSlide.title}`);
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Alerts helper
  const showNotification = (type: "success" | "error", text: string) => {
    setActionMessage({ type, text });
    setTimeout(() => {
      setActionMessage(null);
    }, 4500);
  };

  // Slide mutations
  const handleDeleteSlide = (id: number) => {
    if (localSlides.length <= 1) {
      showNotification("error", "At least one landscape slide must remain configured.");
      return;
    }
    setLocalSlides(localSlides.filter(slide => slide.id !== id));
  };

  const handleUpdateSlideTitle = (id: number, title: string) => {
    setLocalSlides(localSlides.map(slide => slide.id === id ? { ...slide, title } : slide));
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageUrlAdd = () => {
    const newSlideId = localSlides.length > 0 ? Math.max(...localSlides.map(s => s.id)) + 1 : 1;
    const newSlide: CarouselSlide = {
      id: newSlideId,
      title: "New Spectacular Sight",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&h=600&q=80"
    };
    setLocalSlides([...localSlides, newSlide]);
  };

  // Packages modifications
  const handleAddPackage = () => {
    const newId = `pkg-custom-${Date.now()}`;
    const newPkg: PackageItem = {
      id: newId,
      duration: "3D / 2N",
      title: "New Customized Expedition",
      tags: ["Custom", "VIP Access"],
      description: "Brief summary describing the travel course highlights, food options, and vehicle preferences.",
      highlights: [
        "Guwahati greeting & comfortable luxury transit",
        "Pristine waterfalls and misty valleys views"
      ],
      itinerary: [
        { day: 1, title: "Transit & Local Sightseeing", desc: "Arrival at pickup station and transfer." },
        { day: 2, title: "Sacred Temple or Waterfall Visit", desc: "VIP guided exploration of core destination." }
      ],
      priceEstimate: "Rs. 9,999",
      popular: false
    };
    setLocalPackages([...localPackages, newPkg]);
  };

  const handleDeletePackage = (id: string) => {
    if (localPackages.length <= 1) {
      showNotification("error", "At least one package travel course must remain in compilation.");
      return;
    }
    setLocalPackages(localPackages.filter(pkg => pkg.id !== id));
  };

  const handlePackageFieldChange = (id: string, field: keyof PackageItem, value: any) => {
    setLocalPackages(localPackages.map(pkg => pkg.id === id ? { ...pkg, [field]: value } : pkg));
  };

  const handleAddHighlight = (pkgId: string) => {
    setLocalPackages(localPackages.map(pkg => {
      if (pkg.id === pkgId) {
        return {
          ...pkg,
          highlights: [...pkg.highlights, "New amazing tour service highlight"]
        };
      }
      return pkg;
    }));
  };

  const handleRemoveHighlight = (pkgId: string, index: number) => {
    setLocalPackages(localPackages.map(pkg => {
      if (pkg.id === pkgId) {
        const copy = [...pkg.highlights];
        copy.splice(index, 1);
        return { ...pkg, highlights: copy };
      }
      return pkg;
    }));
  };

  const handleHighlightChange = (pkgId: string, index: number, value: string) => {
    setLocalPackages(localPackages.map(pkg => {
      if (pkg.id === pkgId) {
        const copy = [...pkg.highlights];
        copy[index] = value;
        return { ...pkg, highlights: copy };
      }
      return pkg;
    }));
  };

  const handleAddItineraryDay = (pkgId: string) => {
    setLocalPackages(localPackages.map(pkg => {
      if (pkg.id === pkgId) {
        const nextDay = pkg.itinerary.length + 1;
        return {
          ...pkg,
          itinerary: [...pkg.itinerary, { day: nextDay, title: "Next Destination", desc: "Activities schedule." }]
        };
      }
      return pkg;
    }));
  };

  const handleRemoveItineraryDay = (pkgId: string, index: number) => {
    setLocalPackages(localPackages.map(pkg => {
      if (pkg.id === pkgId) {
        const copy = [...pkg.itinerary];
        copy.splice(index, 1);
        // Remap days sequentially
        const remapped = copy.map((item, idx) => ({ ...item, day: idx + 1 }));
        return { ...pkg, itinerary: remapped };
      }
      return pkg;
    }));
  };

  const handleItineraryDayFieldChange = (pkgId: string, index: number, field: "title" | "desc", value: string) => {
    setLocalPackages(localPackages.map(pkg => {
      if (pkg.id === pkgId) {
        const copy = [...pkg.itinerary];
        copy[index] = { ...copy[index], [field]: value };
        return { ...pkg, itinerary: copy };
      }
      return pkg;
    }));
  };

  // Global Save
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await saveSettings({
        whatsappNumber: localWhatsapp.trim(),
        promotionalOffer: localPromo.trim(),
        carouselSlides: localSlides,
        packages: localPackages,
        adminPin: localPin.trim(),
        paymentGatewayEnabled: localPaymentGatewayEnabled,
        upiId: localUpiId.trim(),
        upiQrCode: localUpiQrCode,
        razorpayEnabled: localRazorpayEnabled,
        razorpayKeyId: localRazorpayKeyId.trim(),
        marqueeText: localMarqueeText.trim()
      });
      showNotification("success", "Excellent! Configuration saved and deployed securely across the system.");
    } catch (e: any) {
      console.error("Failed to commit settings to Cloud Firestore:", e);
      const errMsg = e?.message || e?.toString() || "";
      let helperText = "Database operations failed.";
      if (errMsg.includes("permission-denied") || errMsg.includes("permissions") || errMsg.includes("Missing or insufficient permissions")) {
        helperText = "Security Access Denied. Verify that your Admin PIN is correct and matches the PIN currently saved in the database.";
      } else if (errMsg.includes("exceeds") || errMsg.includes("limit") || errMsg.includes("size") || errMsg.includes("too large")) {
        helperText = "Payload size limit exceeded. Your images or dynamic data lists must be smaller to save securely to Firebase.";
      } else {
        helperText = `Operation failed: ${errMsg}`;
      }
      showNotification("error", helperText);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm("Are you sure you want to restore the portal back to system defaults? Any custom modifications will be discarded.")) {
      setIsSaving(true);
      try {
        await resetToDefaults();
        // Sync local inputs
        setLocalWhatsapp("916003031569");
        setLocalPromo("Save up to 15% on family package bookings.");
        setLocalSlides(carouselSlides); // reload
        setLocalPackages(packages); // reload
        setLocalPin("1234");
        setLocalPaymentGatewayEnabled(true);
        setLocalUpiId("916003031569@ybl");
        setLocalUpiQrCode("");
        setLocalRazorpayEnabled(false);
        setLocalRazorpayKeyId("");
        setLocalMarqueeText("Maa Kamakhya Special Package only @ Rs. 14,999/Person 2D/1N •  Meghalaya package only @ Rs. 25,999/person 5D/4N");
        showNotification("success", "System values successfully reverted to factory default matrices.");
      } catch (e) {
        showNotification("error", "Factory rollback failed.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-teal-600" />
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mx-auto">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-sans text-slate-900 tracking-tight">Admin Authentication</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Please authorize your operator credentials to alter travel catalog assets</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4 pt-4">
            <div className="space-y-1 text-left">
              <label htmlFor="pincode-input" className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Security Pincode
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="pincode-input"
                  type="password"
                  maxLength={6}
                  placeholder="PIN (Default is 1234)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3 bg-slate-50 border-slate-200/80 text-sm focus:border-teal-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 font-mono tracking-widest text-center"
                />
              </div>
              {authError && (
                <span className="text-[10.5px] text-red-600 font-bold block mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {authError}
                </span>
              )}
            </div>

            <button
              id="admin-validate-btn"
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Unlock Admin Console</span>
            </button>
          </form>

          <button
            onClick={onBack}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors inline-block mt-4 cursor-pointer"
          >
            &larr; Exit back to portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in duration-300">
      
      {/* Admin Panel Header */}
      <div className="px-6 py-6 sm:px-8 border-b border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Lock className="w-4 h-4" />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-2 justify-center sm:justify-start">
              Admin Configuration Control
              <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded border ${
                isFirebaseActive 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}>
                {isFirebaseActive ? "Cloud Sync Live" : "Local Cache Hub"}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Control live packages, carousel slides, price levels, and WhatsApp links.</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="admin-reset-btn"
            onClick={handleResetDefaults}
            disabled={isSaving}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700/80 disabled:opacity-50 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Restore Factory Defaults
          </button>
          
          <button
            id="admin-save-all-btn"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-teal-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> {isSaving ? "Saving..." : "Commit Settings"}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 px-4">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "general"
              ? "border-teal-500 text-teal-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" /> General Sells & Alerts
        </button>
        
        <button
          onClick={() => setActiveTab("images")}
          className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "images"
              ? "border-teal-500 text-teal-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Image className="w-3.5 h-3.5" /> Hero Banners (Upload)
        </button>

        <button
          onClick={() => setActiveTab("packages")}
          className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "packages"
              ? "border-teal-500 text-teal-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> Manage Travel Packages ({localPackages.length})
        </button>

        <button
          onClick={() => {
            setActiveTab("bookings");
            try {
              const saved = localStorage.getItem("northeast_booking_orders") || "[]";
              setBookingOrders(JSON.parse(saved));
            } catch {}
          }}
          className={`px-4 py-3 border-b-2 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "bookings"
              ? "border-teal-500 text-teal-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" /> Customer Booking Orders ({bookingOrders.length})
        </button>
      </div>

      {/* Status Notifications */}
      {actionMessage && (
        <div className={`mx-6 sm:mx-8 mt-6 p-4 rounded-xl border flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-300 ${
          actionMessage.type === "success"
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
            : "bg-red-500/10 border-red-500/20 text-red-300"
         }`}>
          {actionMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          )}
          <span className="text-xs font-medium leading-relaxed">{actionMessage.text}</span>
        </div>
      )}

      {/* Tab Panels */}
      <div className="p-6 sm:p-8 space-y-6">
        
        {activeTab === "general" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
            
            {/* Left Col: Core values */}
            <div className="space-y-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Communication Channels</h3>

                <div className="space-y-1">
                  <label htmlFor="admin-whatsapp-input" className="text-[10px] text-slate-400 font-bold block">
                    WhatsApp Number (with country code)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="admin-whatsapp-input"
                      type="text"
                      value={localWhatsapp}
                      onChange={(e) => setLocalWhatsapp(e.target.value)}
                      placeholder="e.g. 916003031569"
                      className="block w-full rounded-xl border pl-10 pr-4 py-2.5 bg-slate-900 border-slate-800 text-xs focus:border-teal-500 focus:outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <span className="text-[9.5px] text-slate-500 leading-normal block">
                    Ensure country code prefix (e.g. 91 for India) has NO symbols (+ or -).
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">System Authorization</h3>

                <div className="space-y-1">
                  <label htmlFor="admin-pin-input" className="text-[10px] text-slate-400 font-bold block">
                    Change Admin Pincode
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      id="admin-pin-input"
                      type="text"
                      maxLength={8}
                      value={localPin}
                      onChange={(e) => setLocalPin(e.target.value)}
                      placeholder="e.g. 1234"
                      className="block w-full rounded-xl border pl-10 pr-4 py-2.5 bg-slate-900 border-slate-800 text-xs focus:border-teal-500 focus:outline-none transition-all placeholder:text-slate-600 font-mono tracking-wider"
                    />
                  </div>
                  <span className="text-[9.5px] text-slate-500 leading-normal block">
                    Updates to PIN require committing variables. Write this PIN down; it controls validation checks.
                  </span>
                </div>
              </div>

              {/* Payment Acceptance Settings */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Direct booking & payment system</h3>
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">Enable Direct Payments & Bookings</span>
                    <span className="text-[10px] text-slate-500 block">Allow travelers to pay token/full amount directly at checkout.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localPaymentGatewayEnabled}
                      onChange={(e) => setLocalPaymentGatewayEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-350 after:border-slate-300 peer-checked:bg-teal-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                {localPaymentGatewayEnabled && (
                  <div className="space-y-4 pt-2 animate-in fade-in duration-200">
                    <div className="space-y-1">
                      <label htmlFor="admin-upi-input" className="text-[10px] text-slate-400 font-bold block">
                        UPI ID / VPA Address
                      </label>
                      <input
                        id="admin-upi-input"
                        type="text"
                        value={localUpiId}
                        onChange={(e) => setLocalUpiId(e.target.value)}
                        placeholder="e.g. businessname@upi"
                        className="block w-full rounded-xl border px-3.5 py-2.5 bg-slate-900 border-slate-800 text-xs text-white focus:border-teal-500 focus:outline-none"
                      />
                      <span className="text-[9px] text-slate-500 block">Used to generate dynamic Scan & Pay QR codes instantly.</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">
                        Upload Custom Business QR Code Image (UPI)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              const reader = new FileReader();
                              reader.readAsDataURL(file);
                              reader.onload = () => {
                                setLocalUpiQrCode(reader.result as string);
                                showNotification("success", "Custom UPI QR successfully saved locally!");
                              };
                            }
                          }}
                          className="hidden"
                          id="qr-file-input"
                        />
                        <label
                          htmlFor="qr-file-input"
                          className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-bold text-teal-400 hover:text-teal-300 cursor-pointer transition-colors"
                        >
                          Choose QR Image
                        </label>
                        {localUpiQrCode && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10.5px] text-emerald-400 font-bold flex items-center gap-0.5">
                              ✓ Saved
                            </span>
                            <button
                              type="button"
                              onClick={() => setLocalUpiQrCode("")}
                              className="text-[10px] text-red-400 hover:underline"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <hr className="border-slate-850" />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-white block">API Gateway Checkout (Razorpay)</span>
                          <span className="text-[9.5px] text-zinc-500 block">Accept high-limit Credit/Debit cards & wallets.</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={localRazorpayEnabled}
                            onChange={(e) => setLocalRazorpayEnabled(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-350 after:border-slate-300 peer-checked:bg-teal-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>

                      {localRazorpayEnabled && (
                        <div className="space-y-2 pt-1 animate-in slide-in-from-top-1 duration-150">
                          <div className="space-y-1">
                            <label htmlFor="admin-rzp-key" className="text-[10px] text-slate-400 font-bold block">
                              Razorpay API Key ID (rzp_live_...)
                            </label>
                            <input
                              id="admin-rzp-key"
                              type="password"
                              value={localRazorpayKeyId}
                              onChange={(e) => setLocalRazorpayKeyId(e.target.value)}
                              placeholder="rzp_live_xxxxxxxxxx"
                              className="block w-full rounded-xl border px-3.5 py-2.5 bg-slate-900 border-slate-800 text-xs font-mono text-white focus:border-teal-500 focus:outline-none"
                            />
                            <span className="text-[9px] text-amber-400 block font-medium">
                              Note: Leave API Key blank to operate in high-fidelity Sandbox Sandbox checkout test mode.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Promotion Alert banner & Scrolling Ticker */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Promotional Announcement Alert</h3>
                  
                  <div className="space-y-1">
                    <label htmlFor="admin-promo-input" className="text-[10px] text-slate-400 font-bold block">
                      Alert text (Top notification banner)
                    </label>
                    <textarea
                      id="admin-promo-input"
                      rows={2}
                      value={localPromo}
                      onChange={(e) => setLocalPromo(e.target.value)}
                      placeholder="Enter customized promotion, highlights deals or alert message..."
                      className="block w-full rounded-xl border px-4 py-2 bg-slate-900 border-slate-800 text-xs focus:border-teal-500 focus:outline-none transition-all placeholder:text-slate-600 resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-900 pt-4">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Scrolling Marquee Text Strip</h3>
                  
                  <div className="space-y-1">
                    <label htmlFor="admin-marquee-input" className="text-[10px] text-slate-400 font-bold block">
                      Scrolling Ticker Content (Homepage Banner)
                    </label>
                    <textarea
                      id="admin-marquee-input"
                      rows={3}
                      value={localMarqueeText}
                      onChange={(e) => setLocalMarqueeText(e.target.value)}
                      placeholder="Enter scrolling marquee message, separate offers with ★..."
                      className="block w-full rounded-xl border px-4 py-2 bg-slate-900 border-slate-800 text-xs focus:border-teal-500 focus:outline-none transition-all placeholder:text-slate-600 resize-none font-mono text-emerald-400"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-4 md:mt-0">
                <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/10 text-teal-400 text-xs leading-relaxed space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Real-Time Alert Live Preview</span>
                  </div>
                  <div className="bg-teal-900 text-white text-[9.5px] font-bold py-1 px-3 text-center rounded ring-1 ring-teal-500/20">
                    {localPromo || "(Banner is toggled inactive)"}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-teal-200 text-xs leading-relaxed space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-400">
                    <span>Marquee Strip Live Preview</span>
                  </div>
                  <div className="bg-slate-900 text-teal-400 text-[10px] font-bold py-1 px-3 rounded overflow-hidden relative select-none">
                    <div className="whitespace-nowrap inline-block animate-[marquee-packages_15s_linear_infinite]">
                      {localMarqueeText || "(Marquee is empty)"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === "images" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Drag Drop Uploader */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Hero Banner Media Manager</h3>
                
                {/* Drag and Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={handleTriggerFileInput}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
                    dragActive
                      ? "border-teal-500 bg-teal-500/5"
                      : "border-slate-800 hover:border-slate-700 bg-slate-900/45 hover:bg-slate-900/80"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center">
                    <UploadCloud className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-white block">Drag and drop any banner file here</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Accepts PNG, JPG, WEBP formats. Converts immediately to local persistent binary strings.</span>
                  </div>
                  <div className="text-[10.5px] bg-slate-850 px-3 py-1 rounded-lg border border-slate-750 text-teal-400 font-bold inline-block">
                    Or click to browse file system
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Alternative Operations</span>
                  <button
                    onClick={handleImageUrlAdd}
                    className="text-[10px] font-black text-teal-400 hover:text-teal-300 flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-850 tracking-wider cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Placeholder Unsplash URL
                  </button>
                </div>
              </div>

              {/* Banner guidelines */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" /> Photo Sizing Standard
                  </h3>
                  <ul className="text-[11px] text-slate-400 space-y-2 list-disc pl-4 leading-relaxed">
                    <li>Landscape aspect ratio (e.g. 16:9, or width at least 1600px with approx 600px height is highly recommended).</li>
                    <li>Files are converted locally so they persist across reboots, meaning you will never lose dynamic assets.</li>
                    <li>You can provide titles on slides which will be compiled above the main showcase area.</li>
                  </ul>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-[10.5px] text-zinc-400 leading-normal">
                  <p className="font-bold text-white mb-1 uppercase text-[8.5px] tracking-wider text-teal-400">Database Optimizer</p>
                  Settings, images, and package cards synchronize with local storages and your custom enterprise rule arrays simultaneously, ensuring continuous reliability.
                </div>
              </div>

            </div>

            {/* Configured Banner Slides Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Currently Configured Banner Slides ({localSlides.length})</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {localSlides.map((slide) => (
                  <div key={slide.id} className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col structure-card">
                    {/* Thumbnail */}
                    <div className="h-32 bg-slate-900 relative">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover select-none"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-650 hover:bg-red-700 hover:scale-105 text-white rounded-lg border border-red-600 shadow-lg cursor-pointer transition-all"
                        title="Delete image slide"
                      >
                        <Trash2 className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    {/* Meta Fields */}
                    <div className="p-3 bg-slate-950 space-y-2 flex-grow flex flex-col justify-between">
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => handleUpdateSlideTitle(slide.id, e.target.value)}
                        placeholder="Slide Header Title..."
                        className="w-full bg-slate-900 border border-slate-850 px-2 py-1.5 text-[11px] rounded transition-colors text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === "packages" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Active Travel Course Cards</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Edit price limits, titles, days highlights or generate new dynamic routes.</p>
              </div>
              <button
                id="admin-add-pkg-btn"
                onClick={handleAddPackage}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Package Tour
              </button>
            </div>

            {/* List packages with full edit forms */}
            <div className="space-y-6">
              {localPackages.map((pkg, pIndex) => (
                <div key={pkg.id} className="bg-slate-950 p-5 rounded-3xl border border-slate-800/80 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-600" />
                  
                  {/* Action Bar */}
                  <div className="flex items-center justify-between border-b border-slate-850 pb-3 gap-4">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">
                      Card #{pIndex + 1} ({pkg.id})
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pkg.popular || false}
                          onChange={(e) => handlePackageFieldChange(pkg.id, "popular", e.target.checked)}
                          className="rounded border-slate-800 bg-slate-900 text-teal-600 focus:ring-teal-500 focus:ring-offset-slate-950 outline-none w-3.5 h-3.5"
                        />
                        <span>Flag as Popular Choice badge</span>
                      </label>

                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="px-2.5 py-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-500/10 hover:border-red-500/20 text-red-400 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" /> Delete Package
                      </button>
                    </div>
                  </div>

                  {/* Basic settings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label htmlFor={`pkg-title-${pkg.id}`} className="text-[9.5px] text-slate-400 font-bold block uppercase tracking-wider">Tournament / Package Title</label>
                      <input
                        id={`pkg-title-${pkg.id}`}
                        type="text"
                        value={pkg.title}
                        onChange={(e) => handlePackageFieldChange(pkg.id, "title", e.target.value)}
                        className="block w-full rounded-xl border px-3 py-2 bg-slate-900 border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor={`pkg-duration-${pkg.id}`} className="text-[9.5px] text-slate-400 font-bold block uppercase tracking-wider">Duration Estimate (e.g. 5D / 4N)</label>
                      <input
                        id={`pkg-duration-${pkg.id}`}
                        type="text"
                        value={pkg.duration}
                        onChange={(e) => handlePackageFieldChange(pkg.id, "duration", e.target.value)}
                        className="block w-full rounded-xl border px-3 py-2 bg-slate-900 border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor={`pkg-price-${pkg.id}`} className="text-[9.5px] text-slate-400 font-bold block uppercase tracking-wider">Price Estimate (e.g. Rs. 14,999)</label>
                      <input
                        id={`pkg-price-${pkg.id}`}
                        type="text"
                        value={pkg.priceEstimate}
                        onChange={(e) => handlePackageFieldChange(pkg.id, "priceEstimate", e.target.value)}
                        className="block w-full rounded-xl border px-3 py-2 bg-slate-900 border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-bold text-teal-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor={`pkg-desc-${pkg.id}`} className="text-[9.5px] text-slate-400 font-bold block uppercase tracking-wider">Brief Promo Description</label>
                    <textarea
                      id={`pkg-desc-${pkg.id}`}
                      rows={2}
                      value={pkg.description}
                      onChange={(e) => handlePackageFieldChange(pkg.id, "description", e.target.value)}
                      className="block w-full rounded-xl border px-3 py-2 bg-slate-900 border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 resize-none"
                    />
                  </div>

                  {/* Highlights checklist fields */}
                  <div className="space-y-2 border-t border-slate-850 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Key Highlights (Checklist bullets)</span>
                      <button
                        onClick={() => handleAddHighlight(pkg.id)}
                        className="text-[9px] font-black text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> Add highlight item
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {pkg.highlights.map((highlight, hIndex) => (
                        <div key={hIndex} className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-500 font-mono w-4 shrink-0">#{hIndex + 1}</span>
                          <input
                            type="text"
                            value={highlight}
                            onChange={(e) => handleHighlightChange(pkg.id, hIndex, e.target.value)}
                            className="block w-full rounded-xl border px-3 py-1.5 bg-slate-900 border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                          />
                          <button
                            onClick={() => handleRemoveHighlight(pkg.id, hIndex)}
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-red-400 rounded-lg border border-slate-800 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step-by-Step Itinerary days */}
                  <div className="space-y-3 border-t border-slate-850 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Scenic Itinerary Schedule ({pkg.itinerary.length} Days)</span>
                      <button
                        onClick={() => handleAddItineraryDay(pkg.id)}
                        className="text-[9px] font-black text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> Add Itinerary Day
                      </button>
                    </div>

                    <div className="space-y-2 bg-slate-900/40 p-3 rounded-2xl border border-slate-850">
                      {pkg.itinerary.map((dayPlan, dIndex) => (
                        <div key={dIndex} className="p-3 border-b border-slate-850/60 last:border-0 rounded-lg flex flex-col md:flex-row items-start gap-3 relative bg-slate-900/50">
                          
                          <div className="flex items-center gap-2 md:w-[12%] py-1 shrink-0">
                            <span className="text-xs font-black text-teal-400 font-mono">DAY {dayPlan.day}</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-grow md:w-[80%]">
                            <div className="space-y-1 md:col-span-1">
                              <input
                                type="text"
                                placeholder={`Day ${dayPlan.day} heading...`}
                                value={dayPlan.title}
                                onChange={(e) => handleItineraryDayFieldChange(pkg.id, dIndex, "title", e.target.value)}
                                className="block w-full rounded-lg border px-2.5 py-1.5 bg-slate-950 border-slate-800 text-xs text-white"
                              />
                            </div>
                            
                            <div className="space-y-1 md:col-span-2">
                              <input
                                type="text"
                                placeholder="Schedule activities detail..."
                                value={dayPlan.desc}
                                onChange={(e) => handleItineraryDayFieldChange(pkg.id, dIndex, "desc", e.target.value)}
                                className="block w-full rounded-lg border px-2.5 py-1.5 bg-slate-950 border-slate-800 text-xs text-white"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveItineraryDay(pkg.id, dIndex)}
                            className="bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-750 text-red-400 p-2 rounded-lg cursor-pointer shrink-0 align-middle self-center font-bold"
                            title="Remove this day from travel plan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black uppercase text-white tracking-widest">Direct Checked Bookings Logs</h3>
                <p className="text-xs text-slate-500 mt-1">Review live checkouts, traveler settings, and coordinate assigned driver plans.</p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm("Do you want to wipe all booking submission records from your local storage cache?")) {
                    localStorage.removeItem("northeast_booking_orders");
                    setBookingOrders([]);
                  }
                }}
                className="px-3.5 py-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/30 text-red-400 rounded-xl text-[10.5px] font-bold cursor-pointer transition-colors self-start"
              >
                Clear Booking Logs
              </button>
            </div>

            {bookingOrders.length === 0 ? (
              <div className="bg-slate-950 border border-slate-850 rounded-2xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">No customer bookings yet</h4>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-normal">
                    When customers choose packages and complete checkout on the frontend, bookings with UPI/UTR numbers will compile and display here instantly.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {bookingOrders.map((ord: any) => (
                  <div key={ord.id} className="bg-slate-950 border border-slate-805 rounded-2xl overflow-hidden shadow-xl">
                    {/* Header */}
                    <div className="bg-slate-905 px-5 py-4 border-b border-slate-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black font-mono text-teal-400 uppercase bg-teal-950/30 border border-teal-500/10 px-2.5 py-1 rounded">
                          {ord.id || "N/A"}
                        </span>
                        <span className="text-[10px] uppercase font-black tracking-widest bg-slate-850 text-slate-400 px-2 py-0.5 rounded">
                          {ord.paymentMethod || "Direct"}
                        </span>
                        <span className="text-[10.5px] font-bold text-slate-500">
                          {ord.timestamp ? new Date(ord.timestamp).toLocaleDateString() + " " + new Date(ord.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Recent"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 self-stretch sm:self-auto justify-end">
                        <span className="text-xs text-slate-500 font-bold">Total Cost:</span>
                        <span className="text-xs font-black text-white font-mono bg-teal-950/20 border border-teal-500/10 px-2.5 py-0.5 rounded text-teal-400">
                          Rs. {ord.totalPrice ? ord.totalPrice.toLocaleString("en-IN") : "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Details content */}
                    <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
                      {/* Passenger column */}
                      <div className="space-y-2 md:border-r md:border-slate-850/60 pr-4">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Lead Traveler contact</span>
                        <div className="space-y-1">
                          <strong className="text-sm font-black text-white block">
                            {ord.customerName}
                          </strong>
                          <span className="text-[11px] text-slate-400 block">{ord.customerEmail}</span>
                          <span className="text-[11px] text-teal-400 font-mono font-bold block">{ord.customerWhatsapp}</span>
                        </div>
                      </div>

                      {/* Travel course choices */}
                      <div className="space-y-2 md:border-r md:border-slate-850/60 pr-4">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Travel course parameters</span>
                        <div className="space-y-1">
                          <span className="text-white font-bold block">{ord.packageName} ({ord.duration || "Course"})</span>
                          <span className="text-slate-400 block">Date of Tour: <span className="text-teal-500 font-bold">{ord.travelDate}</span></span>
                          <span className="text-slate-400 block">Travellers: <span className="text-slate-200 font-bold">{ord.peopleCount} Adults</span></span>
                          <span className="text-slate-400 block">Depart: <span className="text-slate-200 font-bold">{ord.pickupPoint}</span></span>
                        </div>
                      </div>

                      {/* Accomodation & Cab options */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Upgrade options & details</span>
                        <div className="space-y-1 text-slate-400">
                          <span className="block">Hotel: <strong className="text-white font-bold">{ord.budgetLevel}</strong></span>
                          <span className="block">assigned vehicle: <strong className="text-slate-200 font-bold">{ord.vehicleType}</strong></span>
                          <span className="block">VIP temple Pass: <strong className={ord.includeVipPass ? "text-amber-400 font-extrabold" : "text-slate-500 font-medium"}>{ord.includeVipPass ? "VIP Included" : "None"}</strong></span>
                          <span className="block text-emerald-400 flex items-center gap-1.5 pt-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                            <span className="font-bold">{ord.paymentStatus}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Control Actions bottom drawer */}
      <div className="bg-slate-950 px-6 sm:px-8 py-5 border-t border-slate-800 flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" /> Back to Travel Portal
        </button>

        <span className="text-[10px] text-slate-500 font-bold hidden sm:inline uppercase tracking-widest leading-none font-sans">
          thespritual.in Hub Panel
        </span>
      </div>

    </div>
  );
}
