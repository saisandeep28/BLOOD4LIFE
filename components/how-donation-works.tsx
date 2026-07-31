'use client';

import { FileText, ClipboardCheck, HeartHandshake } from 'lucide-react';

export default function HowDonationWorks() {
  return (
    <section className="py-16 md:py-24 bg-background border-b border-border relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        
        {/* Header with Decorative SVG Looping Path */}
        <div className="text-center max-w-xl mx-auto relative mb-16 space-y-3">
          
          {/* Decorative Blood Bag & Looping Line Illustration */}
          <div className="absolute -top-12 left-0 right-0 hidden md:flex items-center justify-between pointer-events-none px-4 opacity-80">
            {/* Left Blood Bag Icon Graphic */}
            <div className="w-10 h-14 border-2 border-neutral-400 dark:border-neutral-600 rounded-b-xl relative bg-background shadow-sm flex flex-col justify-end p-1">
              <div className="w-full bg-[#8b0000] dark:bg-red-600 h-3/4 rounded-b-lg" />
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-2 bg-neutral-400 dark:bg-neutral-600 rounded-t" />
            </div>

            {/* SVG Looping Dashed Path */}
            <svg viewBox="0 0 500 80" className="w-3/4 h-16 stroke-neutral-400 dark:stroke-neutral-600 fill-none stroke-[2] stroke-dasharray-[6_6]">
              <path d="M 10 40 Q 150 -20 250 40 T 490 40" />
            </svg>

            {/* Right Heart Icon Graphic */}
            <div className="w-10 h-10 rounded-full border-2 border-neutral-400 dark:border-neutral-600 flex items-center justify-center bg-background shadow-sm text-[#8b0000] dark:text-red-500">
              <div className="w-5 h-5 bg-[#8b0000] dark:bg-red-600 rounded-b-full" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-[#8b0000] dark:text-red-500 tracking-tight">
            How Donation Works
          </h2>
          
          <p className="text-neutral-600 dark:text-neutral-300 text-sm md:text-base font-medium">
            Register, get a quick health check, and donate - a simple process to help save lives.
          </p>
        </div>

        {/* 3 Step Process Grid with Dashed Line Connectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative">
          
          {/* Step 1: Registration Process */}
          <div className="flex flex-col items-center text-center space-y-3 z-10">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[#8b0000] dark:text-red-400 shadow-sm">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-foreground">
              Registration Process
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm leading-relaxed max-w-xs">
              Sign up and schedule your first donation with ease
            </p>
          </div>

          {/* Step 2: Health Screening */}
          <div className="flex flex-col items-center text-center space-y-3 z-10 relative">
            
            {/* Desktop Left Dashed Connector Line */}
            <div className="hidden md:block absolute -left-1/2 top-7 w-full border-t-2 border-dashed border-red-500/30 pointer-events-none" />

            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[#8b0000] dark:text-red-400 shadow-sm relative z-10">
              <ClipboardCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-foreground">
              Health Screening
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm leading-relaxed max-w-xs">
              A simple check-up to ensure you’re ready to donate
            </p>
          </div>

          {/* Step 3: Donation Day */}
          <div className="flex flex-col items-center text-center space-y-3 z-10 relative">
            
            {/* Desktop Right Dashed Connector Line */}
            <div className="hidden md:block absolute -left-1/2 top-7 w-full border-t-2 border-dashed border-red-500/30 pointer-events-none" />

            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[#8b0000] dark:text-red-400 shadow-sm relative z-10">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-foreground">
              Donation Day
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm leading-relaxed max-w-xs">
              Relax as our professional staff guide you through
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
