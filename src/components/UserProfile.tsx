import React, { useState, useEffect } from "react";
import { 
  User, Phone, Mail, Award, CheckCircle, ShieldAlert, 
  MapPin, Clipboard, CheckSquare, Plus, Trash2, HeartHandshake,
  Compass, AlertTriangle, Calendar, Sparkles
} from "lucide-react";

export default function UserProfile() {
  // User profile loaded from localStorage
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O +ve");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // High altitude hill checklist
  const [items, setItems] = useState<{ id: string; text: string; checked: boolean }[]>([
    { id: "1", text: "Sturdy non-slip mountain boots (essential for root bridges trekking)", checked: true },
    { id: "2", text: "Windbreaker & high-grade umbrella (Cherrapunji has unpredictable rainfall)", checked: true },
    { id: "3", text: "Modest attire (shoulders & legs covered) for Kamakhya Shrine visit", checked: false },
    { id: "4", text: "Warm heavy pullover / fleece (nights get chilly in Shillong & Cherrapunji)", checked: false },
    { id: "5", text: "Personal medicines & altitude motion sickness pills (winding hill roads)", checked: false },
    { id: "6", text: "Waterproof dry bag for camera/phone (waterfall spray tracking)", checked: false },
    { id: "7", text: "Aadhar/Passport physical copy (needed for State checkpoint permits)", checked: false }
  ]);

  const [newItemText, setNewItemText] = useState("");

  // Load and save logic
  useEffect(() => {
    const savedName = localStorage.getItem("traveler_name") || "";
    const savedWhatsapp = localStorage.getItem("traveler_whatsapp") || "";
    const savedEmail = localStorage.getItem("traveler_email") || "";
    const savedBlood = localStorage.getItem("traveler_blood") || "B +ve";
    const savedEmergency = localStorage.getItem("traveler_emergency") || "";
    const savedChecklist = localStorage.getItem("traveler_checklist");

    setName(savedName);
    setWhatsapp(savedWhatsapp);
    setEmail(savedEmail);
    setBloodGroup(savedBlood);
    setEmergencyPhone(savedEmergency);

    if (savedChecklist) {
      try {
        setItems(JSON.parse(savedChecklist));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("traveler_name", name);
    localStorage.setItem("traveler_whatsapp", whatsapp);
    localStorage.setItem("traveler_email", email);
    localStorage.setItem("traveler_blood", bloodGroup);
    localStorage.setItem("traveler_emergency", emergencyPhone);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleToggleItem = (id: string) => {
    const updated = items.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
    setItems(updated);
    localStorage.setItem("traveler_checklist", JSON.stringify(updated));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      checked: false
    };
    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem("traveler_checklist", JSON.stringify(updated));
    setNewItemText("");
  };

  const handleRemoveItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    localStorage.setItem("traveler_checklist", JSON.stringify(updated));
  };

  return (
    <div className="space-y-8 text-left">
      {/* Visual Header Banner info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-teal-600" />
            Traveler Profile & Assist Panel
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Store digital credentials securely on your device to pre-populate booking terminals and manage altitude checklists.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Profile edit form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100">
              <Sparkles className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">Personal Info Terminal</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Device-secured private parameters</p>
            </div>
          </div>

          <form onSubmit={saveProfile} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wide block">Primary Traveler Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full text-xs font-bold text-slate-900 bg-slate-55 bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-3.5 focus:border-teal-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wide block">WhatsApp Contact Number</label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. 919876543210"
                  className="w-full text-xs font-bold text-slate-900 bg-slate-55 bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-3.5 focus:border-teal-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wide block">Blood Group Class</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 bg-slate-55 bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-3.5 focus:border-teal-500 focus:bg-white focus:outline-none transition-all"
                >
                  <option value="A +ve">A +ve</option>
                  <option value="A -ve">A -ve</option>
                  <option value="B +ve">B +ve</option>
                  <option value="B -ve">B -ve</option>
                  <option value="AB +ve">AB +ve</option>
                  <option value="O +ve">O +ve</option>
                  <option value="O -ve">O -ve</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wide block">Digital Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@example.com"
                className="w-full text-xs font-bold text-slate-900 bg-slate-55 bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-3.5 focus:border-teal-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wide block">Emergency Contact Phone Number</label>
              <input
                type="text"
                required
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="e.g. +91 94350-XXXXX for emergencies"
                className="w-full text-xs font-bold text-slate-900 bg-slate-55 bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-3.5 focus:border-teal-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl cursor-pointer shadow-md shadow-teal-600/10 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Save Local Credentials
            </button>

            {isSaved && (
              <span className="text-[10px] text-emerald-600 font-extrabold text-center block bg-emerald-50 border border-emerald-100 py-1.5 rounded-lg animate-bounce">
                ✓ Traveler settings configured & cached on local browser session!
              </span>
            )}
          </form>
        </div>

        {/* Right column: Checklist & safety hotline guides */}
        <div className="lg:col-span-7 space-y-6">
          {/* Packing checklist state */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <CheckSquare className="w-4.5 h-4.5 text-teal-600" /> Hills Packing & Permits Checklist
                </h4>
                <p className="text-[10px] text-slate-450 font-medium">Verify your preparedness before landing at Guwahati</p>
              </div>

              <span className="text-[10px] bg-teal-50 text-teal-800 font-black px-2.5 py-0.5 rounded-md border border-teal-100">
                {items.filter(i => i.checked).length} of {items.length} Checked
              </span>
            </div>

            {/* Checklist items list */}
            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
              {items.map((it) => (
                <div 
                  key={it.id}
                  onClick={() => handleToggleItem(it.id)}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    it.checked 
                      ? "bg-slate-50/30 border-slate-200/50 opacity-70" 
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={it.checked}
                    readOnly
                    className="w-4 h-4 rounded mt-0.5 accent-teal-600 border-slate-300 pointer-events-none"
                  />
                  <span className={`text-xs font-medium text-slate-700 flex-grow ${it.checked ? "line-through text-slate-400" : ""}`}>
                    {it.text}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(it.id);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Custom item creation */}
            <form onSubmit={handleAddItem} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="e.g. Waterproof trekking umbrella"
                className="flex-grow text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-teal-500 focus:bg-white"
              />
              <button
                type="submit"
                className="bg-slate-900 text-white font-extrabold text-xs px-4 py-2 rounded-xl hover:bg-slate-800 cursor-pointer transition-all flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </form>
          </div>

          {/* Special Tourist Safety & Emergency Assist hotlines */}
          <div className="bg-sky-50 border border-sky-100 rounded-3xl p-6 space-y-4">
            <span className="text-[10px] font-black uppercase bg-sky-200 text-sky-900 border border-sky-200 px-3 py-1 rounded-md block w-fit">
              🏔️ Northeast Tourism Safety Hotlines
            </span>

            <div className="space-y-3 font-sans text-xs text-sky-850">
              <p className="leading-relaxed text-[11px] text-sky-800">
                Northeast India has beautiful, friendly, and very secure hills. However, for continuous administrative trust, always save these contacts on your smartphone:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/75 border border-sky-100 text-left">
                  <h5 className="font-extrabold text-sky-950 text-xs">Tourist Police (Shillong)</h5>
                  <p className="text-[10px] text-sky-650 mt-0.5">Assistance at Police Bazaar & sightseeing points</p>
                  <span className="font-black text-sky-900 block mt-1.5">📞 +91 364 222-2277</span>
                </div>

                <div className="p-3 rounded-xl bg-white/75 border border-sky-100 text-left">
                  <h5 className="font-extrabold text-sky-950 text-xs">State Tourist Help Desk</h5>
                  <p className="text-[10px] text-sky-650 mt-0.5">Assam & Meghalaya Tourism Department</p>
                  <span className="font-black text-sky-900 block mt-1.5">📞 1800-345-3859</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/40 border border-sky-100 flex items-start gap-2 text-sky-900/80">
                <AlertTriangle className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
                <p className="text-[9.5px] leading-relaxed">
                  <strong>Permit Guide Note</strong>: Indian nationals need an <strong>Inner Line Permit (ILP)</strong> for entering Mizoram, Nagaland, and Arunachal Pradesh. Sikkim & Meghalaya border zones require restricted area permits. Your car driver handles checkpoint logging automatically.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
