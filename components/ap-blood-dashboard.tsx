'use client';

import { Droplet, Building2, CalendarDays, Tent } from 'lucide-react';

export default function APBloodDashboard() {
  return (
    <section className="bg-white border-b border-neutral-200 py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Left Column - Content & Stats */}
          <div className="space-y-8 z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#8b0000] mb-1">
                Statewide Presence.
              </h2>
              <h2 className="text-3xl md:text-4xl font-bold text-[#8b0000] mb-3">
                Ensuring Accessibility Across A.P.
              </h2>
              <p className="text-sm md:text-base text-neutral-700 font-medium">
                A Connected Network of Blood Centers Serving Every District
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#fafafa] dark:bg-neutral-900 rounded-lg p-5 border border-neutral-100 dark:border-neutral-800 shadow-sm transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-3">
                  <Droplet className="w-5 h-5 text-[#8b0000]" fill="#8b0000" fillOpacity="0.2" />
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider">Total Donor Registration</span>
                </div>
                <div className="text-3xl font-bold text-[#8b0000]">95124</div>
              </div>

              <div className="bg-[#fafafa] dark:bg-neutral-900 rounded-lg p-5 border border-neutral-100 dark:border-neutral-800 shadow-sm transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-[#8b0000]" />
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider">Total Blood Centers</span>
                </div>
                <div className="text-3xl font-bold text-[#8b0000]">240</div>
              </div>

              <div className="bg-[#fafafa] dark:bg-neutral-900 rounded-lg p-5 border border-neutral-100 dark:border-neutral-800 shadow-sm transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarDays className="w-5 h-5 text-[#e67e22]" />
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider">Total Upcoming Camps</span>
                </div>
                <div className="text-3xl font-bold text-[#8b0000]">9</div>
              </div>

              <div className="bg-[#fafafa] dark:bg-neutral-900 rounded-lg p-5 border border-neutral-100 dark:border-neutral-800 shadow-sm transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-3">
                  <Tent className="w-5 h-5 text-neutral-500" />
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider">Camps Organised</span>
                </div>
                <div className="text-3xl font-bold text-[#8b0000]">10044</div>
              </div>
            </div>
          </div>

          {/* Right Column - Andhra Pradesh Colored Map */}
          <div className="flex justify-center items-center">
            <div className="w-full max-w-[520px]">
              <img
                src="/andhra_pradesh_districts_colored_4k.png"
                alt="Andhra Pradesh Districts Map"
                className="w-full h-auto drop-shadow-lg rounded-xl object-contain"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
