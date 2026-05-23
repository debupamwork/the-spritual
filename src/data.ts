import { PackageItem, TestimonialItem, FAQItem } from "./types";

export const popularPackages: PackageItem[] = [
  {
    id: "pkg-kamakhya-premium",
    duration: "2D / 1N",
    title: "Maa Kamakhya Premium Darshan",
    tags: ["VIP Entry Included", "Spiritual", "Guwahati Luxury"],
    description: "Pre-arranged fast-track VIP temple entry, specialized pandit guide, luxury vehicles, and Brahmaputra sunset cruise.",
    highlights: [
      "Guaranteed fast-track VIP Special Entry ticket",
      "Dedicated pandit for sacred Puja rituals",
      "Romantic Sunset Dinner Cruise on Brahmaputra",
      "5-star luxury hotel in Guwahati with breakfast"
    ],
    itinerary: [
      {
        day: 1,
        title: "Sunset Cruise & Guwahati Lights",
        desc: "Airport VIP greeting in private luxury Audi/Innova. Beautiful evening sunset cruise across Brahmaputra. Standard 5-star hotel check-in."
      },
      {
        day: 2,
        title: "Exclusive VIP Kamakhya Darshan & Drop",
        desc: "Early morning special gate bypass entry assistance at Kamakhya Temple. Umananda Island boat trip. Afternoon transfer to Airport."
      }
    ],
    priceEstimate: "Rs. 14,999",
    popular: true
  },
  {
    id: "pkg-3d2n-nature",
    duration: "3D / 2N",
    title: "Meghalaya Misty Highlights",
    tags: ["Customizable", "Nature Escape"],
    description: "A compact curated visual journey covering beautiful waterfalls of Cherrapunji and crystal Dawki boating.",
    highlights: [
      "Spectacular Wei Sawdong and Nohkalikai falls",
      "Rowing in transparent glass-like waters of Dawki",
      "Spottless Mawlynnong (Asia's cleanest village)",
      "Premium local home/hotel stays with balcony views"
    ],
    itinerary: [
      {
        day: 1,
        title: "Guwahati to Shillong",
        desc: "Airport pickup. Enjoy scenic Umiam lake views and vibrant Shillong Police Bazaar evening."
      },
      {
        day: 2,
        title: "Cherrapunji (Sohra) Cascades",
        desc: "Hike Wei Sawdong deep steps, stand beside majestic Nohkalikai, stay in a cozy mountain homestay."
      },
      {
        day: 3,
        title: "Dawki Boating & Return Drop",
        desc: "Crystal-clear waters boating in Shnongpdeng. Return private drop at Guwahati airport."
      }
    ],
    priceEstimate: "Rs. 7,499",
    popular: false
  },
  {
    id: "pkg-5d4n-sacred",
    duration: "5D / 4N",
    title: "Sacred & Pristine Northeast",
    tags: ["Best Selling Combo", "Guwahati + Meghalaya"],
    description: "The ultimate hassle-free combination of divine Kamakhya special entry and majestic Meghalaya natural wonders.",
    highlights: [
      "Special VIP pass at Maa Kamakhya Temple",
      "Explore Laitlum Canyons 'End of the World'",
      "Stay in scenic river-side camps in Dawki",
      "Private luxury cab & certified expert driver"
    ],
    itinerary: [
      {
        day: 1,
        title: "VIP Kamakhya & Guwahati Heritage",
        desc: "Direct luxury airport pickup. Fast-track VIP entry at Kamakhya Temple, Brahmaputra Sunset Cruise."
      },
      {
        day: 2,
        title: "Canyons to Shillong Peaks",
        desc: "Sightseeing at the breathtaking green heights of Laitlum Grand Canyon. Relish evening Shillong cafes."
      },
      {
        day: 3,
        title: "Deep Sohra Rainwaterfalls",
        desc: "Drive down to explore Cherrapunji's limestone caves, Mawsmai, and high water streams."
      },
      {
        day: 4,
        title: "Dawki Boating & Living Root Walks",
        desc: "Ancient Living Root bridges walk, ride boats on the Umngot River, outdoor bonfire dinner."
      },
      {
        day: 5,
        title: "Guwahati Return Transit",
        desc: "Sunrise valley walk, drive back to Guwahati Station or GAU Airport for final farewell."
      }
    ],
    priceEstimate: "Rs. 18,499",
    popular: false
  }
];

export const benefitsList = [
  {
    title: "Guwahati Station/Airport pick & drop",
    description: "Door-to-door luxury transit standard.",
    iconName: "Car"
  },
  {
    title: "Private Sanitized Cab",
    description: "Courteous drivers who know the best sights.",
    iconName: "Shield"
  },
  {
    title: "Handpicked Balcony Stays",
    description: "Clean hotels with gorgeous mountain views.",
    iconName: "Home"
  },
  {
    title: "Customized Pace",
    description: "Slow down or add extra points easily.",
    iconName: "Compass"
  },
  {
    title: "24/7 Local Coordination",
    description: "Immediate help for any tour changes.",
    iconName: "PhoneCall"
  },
  {
    title: "Tailored Packages",
    description: "Configured perfectly for families & couples.",
    iconName: "Users"
  }
];

export const testimonialsList: TestimonialItem[] = [
  {
    id: "testm-1",
    name: "Aman & Sneha Sharma",
    location: "Kolkata",
    rating: 5,
    text: "Excellent tour of Kamakhya combined with Shillong. The special VIP temple entry was perfectly pre-arranged, saving us hours.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    date: "April 2026",
    packageTaken: "5D/4N Sacred & Pristine Northeast"
  },
  {
    id: "testm-2",
    name: "Dr. Rachel Thomas",
    location: "Bangalore",
    rating: 5,
    text: "Organized our pilgrimage and mountain trip beautifully. Dedicated private cab and highly respectful of senior citizen pace.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    date: "May 2026",
    packageTaken: "2D/1N Maa Kamakhya Premium Darshan"
  },
  {
    id: "testm-3",
    name: "Vikram Goel",
    location: "New Delhi",
    rating: 5,
    text: "The Brahmaputra cruise was scenic, and boating in the crystal clear Dawki river was phenomenal. Highly recommended partners!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    date: "March 2026",
    packageTaken: "3D/2N Meghalaya Misty Highlights"
  }
];

export const FAQsList: FAQItem[] = [
  {
    id: "faq-1",
    question: "Where does pickup take place?",
    answer: "Right outside Guwahati Airport (GAU) or Railway Station (GHY). Our driver will be waiting holding a name card."
  },
  {
    id: "faq-2",
    question: "When is the best season to visit?",
    answer: "October to April is best for clear crystal waters. June to September is stunning for roaring green waterfalls."
  },
  {
    id: "faq-3",
    question: "Are hotel upgrades available?",
    answer: "Yes, we customize from cosy budget homestays to 4-star luxury resorts with mountain peaks views."
  },
  {
    id: "faq-4",
    question: "What is included in the fare?",
    answer: "Dedicated private cab, fuel, standard tolls, hotel stays, breakfasts, and all driver allowances."
  },
  {
    id: "faq-5",
    question: "How does the VIP Kamakhya Special Entry work?",
    answer: "We pre-arrange your Special Entry passes ('VIP Pass') prior to your arrival. When you reach the hill, our affiliated local Pandit will receive you, bypass standard queue crowds, and guide you directly through the special lane to make your spiritual Darshan seamless and peaceful."
  }
];
