import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseServices, handleFirestoreError, OperationType } from "../lib/firebase";
import { PackageItem } from "../types";
import { popularPackages } from "../data";
import kamakhyaTempleImg from "../assets/images/kamakhya_temple_1779296971036.png";

export interface CarouselSlide {
  id: number;
  title: string;
  image: string;
}

interface SettingsContextType {
  whatsappNumber: string;
  promotionalOffer: string;
  carouselSlides: CarouselSlide[];
  packages: PackageItem[];
  adminPin: string;
  isLoaded: boolean;
  isFirebaseActive: boolean;
  paymentGatewayEnabled: boolean;
  upiId: string;
  upiQrCode: string;
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  marqueeText: string;
  saveSettings: (newSettings: {
    whatsappNumber: string;
    promotionalOffer: string;
    carouselSlides: CarouselSlide[];
    packages: PackageItem[];
    adminPin: string;
    paymentGatewayEnabled: boolean;
    upiId: string;
    upiQrCode: string;
    razorpayEnabled: boolean;
    razorpayKeyId: string;
    marqueeText: string;
  }) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    title: "Maa Kamakhya Temple",
    image: kamakhyaTempleImg
  },
  {
    id: 2,
    title: "Misty Hills of Shillong",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&h=600&q=80"
  },
  {
    id: 3,
    title: "Glassy Waters of Dawki",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&h=600&q=80"
  },
  {
    id: 4,
    title: "Vibrant Cherrapunji",
    image: "https://images.unsplash.com/photo-1432406186267-3c74b88d1ae0?auto=format&fit=crop&w=1600&h=600&q=80"
  }
];

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [whatsappNumber, setWhatsappNumber] = useState<string>("916003031569");
  const [promotionalOffer, setPromotionalOffer] = useState<string>("Save up to 15% on family package bookings.");
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>(DEFAULT_SLIDES);
  const [packages, setPackages] = useState<PackageItem[]>(popularPackages);
  const [adminPin, setAdminPin] = useState<string>("1234");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isFirebaseActive, setIsFirebaseActive] = useState<boolean>(false);

  // New Payment details states
  const [paymentGatewayEnabled, setPaymentGatewayEnabled] = useState<boolean>(true);
  const [upiId, setUpiId] = useState<string>("916003031569@ybl");
  const [upiQrCode, setUpiQrCode] = useState<string>("");
  const [razorpayEnabled, setRazorpayEnabled] = useState<boolean>(false);
  const [razorpayKeyId, setRazorpayKeyId] = useState<string>("");
  const [marqueeText, setMarqueeText] = useState<string>("Maa Kamakhya Special Package only @ Rs. 14,999/Person 2D/1N •  Meghalaya package only @ Rs. 25,999/person 5D/4N");

  // Sync / Load on Mount
  useEffect(() => {
    async function loadConfig() {
      // 1. Try local storage first (instant responsiveness)
      const cachedWhatsapp = localStorage.getItem("kt_whatsappNumber");
      const cachedPromo = localStorage.getItem("kt_promotionalOffer");
      const cachedSlides = localStorage.getItem("kt_carouselSlides");
      const cachedPkgs = localStorage.getItem("kt_packages");
      const cachedPin = localStorage.getItem("kt_adminPin");
      const cachedGatewayEnabled = localStorage.getItem("kt_paymentGatewayEnabled");
      const cachedUpiId = localStorage.getItem("kt_upiId");
      const cachedUpiQrCode = localStorage.getItem("kt_upiQrCode");
      const cachedRazorpayEnabled = localStorage.getItem("kt_razorpayEnabled");
      const cachedRazorpayKeyId = localStorage.getItem("kt_razorpayKeyId");
      const cachedMarquee = localStorage.getItem("kt_marqueeText");

      if (cachedWhatsapp) setWhatsappNumber(cachedWhatsapp);
      if (cachedPromo) setPromotionalOffer(cachedPromo);
      if (cachedSlides) setCarouselSlides(JSON.parse(cachedSlides));
      if (cachedPkgs) setPackages(JSON.parse(cachedPkgs));
      if (cachedPin) setAdminPin(cachedPin);
      if (cachedGatewayEnabled !== null) setPaymentGatewayEnabled(cachedGatewayEnabled === "true");
      if (cachedUpiId) setUpiId(cachedUpiId);
      if (cachedUpiQrCode) setUpiQrCode(cachedUpiQrCode);
      if (cachedRazorpayEnabled !== null) setRazorpayEnabled(cachedRazorpayEnabled === "true");
      if (cachedRazorpayKeyId) setRazorpayKeyId(cachedRazorpayKeyId);
      if (cachedMarquee) {
        setMarqueeText(cachedMarquee);
      } else {
        setMarqueeText("Maa Kamakhya Special Package only @ Rs. 14,999/Person 2D/1N •  Meghalaya package only @ Rs. 25,999/person 5D/4N");
      }

      // 2. Query Firebase Firestore if online/active
      try {
        const { db, isFirebaseAvailable } = await getFirebaseServices();
        setIsFirebaseActive(isFirebaseAvailable);

        if (isFirebaseAvailable && db) {
          const docRef = doc(db, "settings", "site");
          let docSnap;
          let isOffline = false;
          try {
            // Apply a fast 3.5-second fallback timeout to prevent slow connections from freezing boot-time synchronization
            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error("Timeout waiting for Firestore response")), 3500)
            );
            docSnap = await Promise.race([getDoc(docRef), timeoutPromise]);
          } catch (e: any) {
            const errMsg = e instanceof Error ? e.message : String(e);
            if (
              errMsg.includes("offline") ||
              errMsg.includes("Could not reach Cloud Firestore backend") ||
              errMsg.includes("Failed to get document") ||
              errMsg.includes("Timeout") ||
              e.code === "unavailable"
            ) {
              isOffline = true;
              console.warn("⚠️ Firestore is offline on page load. Using offline/local storage parameters.");
            } else {
              handleFirestoreError(e, OperationType.GET, "settings/site");
            }
          }

          if (isOffline) {
            setIsFirebaseActive(false);
          } else if (docSnap && docSnap.exists()) {
            const data = docSnap.data();
            if (data.whatsappNumber) {
              setWhatsappNumber(data.whatsappNumber);
              localStorage.setItem("kt_whatsappNumber", data.whatsappNumber);
            }
            if (data.promotionalOffer !== undefined) {
              setPromotionalOffer(data.promotionalOffer);
              localStorage.setItem("kt_promotionalOffer", data.promotionalOffer);
            }
            if (data.carouselSlides) {
              setCarouselSlides(data.carouselSlides);
              localStorage.setItem("kt_carouselSlides", JSON.stringify(data.carouselSlides));
            }
            if (data.packages) {
              setPackages(data.packages);
              localStorage.setItem("kt_packages", JSON.stringify(data.packages));
            }
            if (data.adminPin) {
              setAdminPin(data.adminPin);
              localStorage.setItem("kt_adminPin", data.adminPin);
            }
            if (data.paymentGatewayEnabled !== undefined) {
              setPaymentGatewayEnabled(!!data.paymentGatewayEnabled);
              localStorage.setItem("kt_paymentGatewayEnabled", data.paymentGatewayEnabled ? "true" : "false");
            }
            if (data.upiId) {
              setUpiId(data.upiId);
              localStorage.setItem("kt_upiId", data.upiId);
            }
            if (data.upiQrCode !== undefined) {
              setUpiQrCode(data.upiQrCode);
              localStorage.setItem("kt_upiQrCode", data.upiQrCode);
            }
            if (data.razorpayEnabled !== undefined) {
              setRazorpayEnabled(!!data.razorpayEnabled);
              localStorage.setItem("kt_razorpayEnabled", data.razorpayEnabled ? "true" : "false");
            }
            if (data.razorpayKeyId !== undefined) {
              setRazorpayKeyId(data.razorpayKeyId);
              localStorage.setItem("kt_razorpayKeyId", data.razorpayKeyId);
            }
            if (data.marqueeText !== undefined) {
              const finalMarquee = data.marqueeText || "Maa Kamakhya Special Package only @ Rs. 14,999/Person 2D/1N •  Meghalaya package only @ Rs. 25,999/person 5D/4N";
              setMarqueeText(finalMarquee);
              localStorage.setItem("kt_marqueeText", finalMarquee);
            }
            console.log("Synced latest site parameters from Cloud Firestore!");
          } else if (docSnap) {
            // Document does not exist in Cloud, initialize it with current state
            const currentObj = {
              whatsappNumber: cachedWhatsapp || "916003031569",
              promotionalOffer: cachedPromo || "Save up to 15% on family package bookings.",
              carouselSlides: cachedSlides ? JSON.parse(cachedSlides) : DEFAULT_SLIDES,
              packages: cachedPkgs ? JSON.parse(cachedPkgs) : popularPackages,
              adminPin: cachedPin || "1234",
              paymentGatewayEnabled: cachedGatewayEnabled !== null ? cachedGatewayEnabled === "true" : true,
              upiId: cachedUpiId || "916003031569@ybl",
              upiQrCode: cachedUpiQrCode || "",
              razorpayEnabled: cachedRazorpayEnabled !== null ? cachedRazorpayEnabled === "true" : false,
              razorpayKeyId: cachedRazorpayKeyId || "",
              marqueeText: cachedMarquee || "Maa Kamakhya Special Package only @ Rs. 14,999/Person 2D/1N •  Meghalaya package only @ Rs. 25,999/person 5D/4N"
            };
            try {
              await setDoc(docRef, currentObj);
            } catch (e: any) {
              const errMsg = e instanceof Error ? e.message : String(e);
              if (
                errMsg.includes("offline") ||
                errMsg.includes("Could not reach Cloud Firestore backend") ||
                errMsg.includes("Failed to get document") ||
                e.code === "unavailable"
              ) {
                console.warn("⚠️ Firestore is offline during settings initialization fallback.");
              } else {
                handleFirestoreError(e, OperationType.CREATE, "settings/site");
              }
            }
            console.log("Created initial config document in Cloud Firestore.");
          }
        }
      } catch (err) {
        console.warn("Could not synchronize with cloud server, operating in high-performance local cache.", err);
      } finally {
        setIsLoaded(true);
      }
    }

    loadConfig();
  }, []);

  const saveSettings = async (newSettings: {
    whatsappNumber: string;
    promotionalOffer: string;
    carouselSlides: CarouselSlide[];
    packages: PackageItem[];
    adminPin: string;
    paymentGatewayEnabled: boolean;
    upiId: string;
    upiQrCode: string;
    razorpayEnabled: boolean;
    razorpayKeyId: string;
    marqueeText: string;
  }) => {
    // Keep track of the old PIN to forward as verification if they are changing it
    const previousPin = adminPin;

    // 1. Commit immediately to local states and storage
    setWhatsappNumber(newSettings.whatsappNumber);
    setPromotionalOffer(newSettings.promotionalOffer);
    setCarouselSlides(newSettings.carouselSlides);
    setPackages(newSettings.packages);
    setAdminPin(newSettings.adminPin);
    setPaymentGatewayEnabled(newSettings.paymentGatewayEnabled);
    setUpiId(newSettings.upiId);
    setUpiQrCode(newSettings.upiQrCode);
    setRazorpayEnabled(newSettings.razorpayEnabled);
    setRazorpayKeyId(newSettings.razorpayKeyId);
    setMarqueeText(newSettings.marqueeText);

    localStorage.setItem("kt_whatsappNumber", newSettings.whatsappNumber);
    localStorage.setItem("kt_promotionalOffer", newSettings.promotionalOffer);
    localStorage.setItem("kt_carouselSlides", JSON.stringify(newSettings.carouselSlides));
    localStorage.setItem("kt_packages", JSON.stringify(newSettings.packages));
    localStorage.setItem("kt_adminPin", newSettings.adminPin);
    localStorage.setItem("kt_paymentGatewayEnabled", newSettings.paymentGatewayEnabled ? "true" : "false");
    localStorage.setItem("kt_upiId", newSettings.upiId);
    localStorage.setItem("kt_upiQrCode", newSettings.upiQrCode);
    localStorage.setItem("kt_razorpayEnabled", newSettings.razorpayEnabled ? "true" : "false");
    localStorage.setItem("kt_razorpayKeyId", newSettings.razorpayKeyId);
    localStorage.setItem("kt_marqueeText", newSettings.marqueeText);

    // 2. Commit to Cloud Firestore synchronously if active
    const { db, isFirebaseAvailable } = await getFirebaseServices();
    if (isFirebaseAvailable && db) {
      try {
        const payload: any = {
          whatsappNumber: newSettings.whatsappNumber,
          promotionalOffer: newSettings.promotionalOffer,
          carouselSlides: newSettings.carouselSlides,
          packages: newSettings.packages,
          adminPin: newSettings.adminPin,
          paymentGatewayEnabled: newSettings.paymentGatewayEnabled,
          upiId: newSettings.upiId,
          upiQrCode: newSettings.upiQrCode,
          razorpayEnabled: newSettings.razorpayEnabled,
          razorpayKeyId: newSettings.razorpayKeyId,
          marqueeText: newSettings.marqueeText
        };

        // If the admin PIN is being modified, provide the old one for security rules validation
        if (newSettings.adminPin !== previousPin) {
          payload.verificationPin = previousPin;
        }

        try {
          await setDoc(doc(db, "settings", "site"), payload);
        } catch (e) {
          handleFirestoreError(e, OperationType.UPDATE, "settings/site");
        }
        console.log("Site parameters updated atomically in Cloud Firestore!");
      } catch (e) {
        console.error("Failed to sync change to Cloud Firestore database rules.", e);
        throw e;
      }
    }
  };

  const resetToDefaults = async () => {
    const defaults = {
      whatsappNumber: "916003031569",
      promotionalOffer: "Save up to 15% on family package bookings.",
      carouselSlides: DEFAULT_SLIDES,
      packages: popularPackages,
      adminPin: "1234",
      paymentGatewayEnabled: true,
      upiId: "916003031569@ybl",
      upiQrCode: "",
      razorpayEnabled: false,
      razorpayKeyId: "",
      marqueeText: "Maa Kamakhya Special Package only @ Rs. 14,999/Person 2D/1N •  Meghalaya package only @ Rs. 25,999/person 5D/4N"
    };
    await saveSettings(defaults);
  };

  return (
    <SettingsContext.Provider
      value={{
        whatsappNumber,
        promotionalOffer,
        carouselSlides,
        packages,
        adminPin,
        isLoaded,
        isFirebaseActive,
        paymentGatewayEnabled,
        upiId,
        upiQrCode,
        razorpayEnabled,
        razorpayKeyId,
        marqueeText,
        saveSettings,
        resetToDefaults
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
