import React from "react";
import { Star, Quote } from "lucide-react";
import { testimonialsList } from "../data";

interface TestimonialsProps {
  onOpenEnquiry: () => void;
}

export default function Testimonials({ onOpenEnquiry }: TestimonialsProps) {
  return (
    <section id="testimonials" className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-teal-600 font-bold uppercase tracking-widest text-[10px] px-2.5 py-1 bg-teal-50 rounded border border-teal-100">
            Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Loved by Travelers
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Read stories from verified couples and families we hosted.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonialsList.map((testm) => (
            <div
              key={testm.id}
              className="bg-slate-50 border border-slate-100 p-6 rounded-2xl relative flex flex-col justify-between"
            >
              <div>
                <span className="absolute top-6 right-6 text-slate-200">
                  <Quote className="w-6 h-6 rotate-180 fill-slate-200/20" />
                </span>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-3">
                  {[...Array(testm.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs text-slate-600 italic leading-relaxed mb-4">
                  "{testm.text}"
                </p>
              </div>

              {/* Author Profile Details */}
              <div className="pt-3 border-t border-slate-200/50">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">{testm.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold">
                    {testm.location} • <span className="text-teal-600">{testm.date}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
