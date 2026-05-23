export interface PackageItem {
  id: string;
  duration: string;
  title: string;
  tags: string[];
  description: string;
  highlights: string[];
  itinerary: { day: number; title: string; desc: string }[];
  priceEstimate: string;
  popular?: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  image: string;
  date: string;
  packageTaken: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface LeadSubmission {
  name: string;
  whatsapp: string;
  travelDate: string;
  peopleCount: string;
  pickupPoint: string;
  budgetRange: string;
  message: string;
}

export interface OnlineBooking {
  id: string; // e.g. NE-5938210
  customerName: string;
  customerWhatsapp: string;
  customerEmail: string;
  packageId: string;
  packageName: string;
  duration: string;
  travelDate: string;
  peopleCount: number;
  pickupPoint: string;
  budgetLevel: string; // "Standard", "Comfort Deluxe", "Premium Luxury"
  includeVipPass: boolean;
  vipPassCount: number;
  vehicleType: string; // "Standard Sedan", "Premium Innova Crysta", "Luxury SUV/Audi"
  totalPrice: number;
  paymentStatus: "Paid Online (100%)" | "Fully Paid" | "Cash on Arrival Authorized";
  paymentMethod: string; // "UPI Instant Scan" | "Credit Card"
  status: "Confirmed (Automation Pending)" | "VIP Temple Passes Registered" | "Mountain Resort Booked" | "High-End SUV & Driver Assigned" | "Live Coordinator Connected";
  driverName?: string;
  driverPhone?: string;
  vibrancyCode: string; // random QR seed or ticket token
  timestamp: string;
}

