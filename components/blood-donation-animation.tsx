'use client';

import { useState, useEffect } from 'react';
import { Heart, Activity, Droplet, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

type BloodComponentType = 'whole' | 'plasma' | 'platelets' | 'rbc';

const COMPONENT_DETAILS: Record<BloodComponentType, { title: string; color: string; bgGlow: string; iconColor: string; description: string; shelfLife: string }> = {
  whole: {
    title: 'Whole Blood',
    color: '#dc2626', // Red
    bgGlow: 'rgba(220, 38, 38, 0.25)',
    iconColor: 'text-red-600',
    description: 'Contains Red Cells, Plasma, & Platelets. Used for trauma & surgery.',
    shelfLife: '35 Days',
  },
  plasma: {
    title: 'Liquid Plasma',
    color: '#eab308', // Amber/Yellow
    bgGlow: 'rgba(234, 179, 8, 0.25)',
    iconColor: 'text-amber-500',
    description: 'Rich in clotting factors. Helps burn victims and bleeding disorders.',
    shelfLife: '1 Year (Frozen)',
  },
  platelets: {
    title: 'Platelets',
    color: '#f97316', // Orange
    bgGlow: 'rgba(249, 115, 22, 0.25)',
    iconColor: 'text-orange-500',
    description: 'Essential for clot formation. Critical for cancer patients undergoing chemo.',
    shelfLife: '5 Days',
  },
  rbc: {
    title: 'Red Blood Cells (RBC)',
    color: '#991b1b', // Deep Maroon
    bgGlow: 'rgba(153, 27, 27, 0.25)',
    iconColor: 'text-red-800',
    description: 'Carries oxygen throughout the body. Given to anemia and accident victims.',
    shelfLife: '42 Days',
  },
};

export default function BloodDonationAnimation() {
  const [isDonating, setIsDonating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [unitsDonated, setUnitsDonated] = useState(1);
  const [selectedType, setSelectedType] = useState<BloodComponentType>('whole');
  const activeDetail = COMPONENT_DETAILS[selectedType];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDonating) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsDonating(false);
            setUnitsDonated((u) => u + 1);
            return 0;
          }
          return prev + 2.5;
        });
      }, 40);
    }
    return () => clearInterval(interval);
  }, [isDonating]);

  const handleStartDonation = () => {
    if (!isDonating) {
      setProgress(0);
      setIsDonating(true);
    }
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white relative overflow-hidden border-t border-b border-neutral-800">
      {/* Dynamic Background Glow */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-700 blur-3xl opacity-20"
        style={{ background: `radial-gradient(circle at 50% 50%, ${activeDetail.color}, transparent 70%)` }}
      />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 bg-red-950/80 border border-red-800/60 px-4 py-1.5 rounded-full text-red-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Simulation
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            See Your Life-Saving Impact in Action
          </h2>
          <p className="text-neutral-400 text-sm md:text-base">
            Click below to simulate donating a single unit of blood (450ml) and trace its flow to save up to 3 lives!
          </p>
        </div>

        {/* Component Selector Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10">
          {(Object.keys(COMPONENT_DETAILS) as BloodComponentType[]).map((type) => {
            const isSelected = selectedType === type;
            const item = COMPONENT_DETAILS[type];
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-neutral-800 border-neutral-600 text-white shadow-lg scale-105'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
                }`}
              >
                <span 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: item.color }} 
                />
                {item.title}
              </button>
            );
          })}
        </div>

        {/* Interactive Simulation Display Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-neutral-900/90 border border-neutral-800 p-6 md:p-10 rounded-3xl backdrop-blur-md shadow-2xl">
          
          {/* Left Donor Heart Unit */}
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              {/* Outer Pulse Ring */}
              <div 
                className={`absolute inset-0 rounded-full transition-all duration-700 animate-ping ${isDonating ? 'opacity-40' : 'opacity-10'}`}
                style={{ backgroundColor: activeDetail.color }}
              />

              {/* Heart Container */}
              <div 
                className="relative w-36 h-36 rounded-full bg-neutral-950 border-2 border-neutral-700 flex items-center justify-center shadow-inner transition-transform duration-300 transform group-hover:scale-105 cursor-pointer"
                onClick={handleStartDonation}
              >
                <Heart 
                  className={`w-16 h-16 transition-all duration-300 ${isDonating ? 'animate-bounce' : ''}`}
                  style={{ color: activeDetail.color, fill: isDonating ? activeDetail.color : 'transparent' }}
                />
                
                {/* Fluid Wave Percentage Inside Heart */}
                <div 
                  className="absolute bottom-0 left-0 right-0 rounded-b-full transition-all duration-200 pointer-events-none opacity-30"
                  style={{ 
                    height: `${progress}%`, 
                    backgroundColor: activeDetail.color 
                  }}
                />
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Donor Unit</span>
              <h3 className="text-xl font-bold text-white mt-0.5">Healthy Donor</h3>
              <p className="text-xs text-neutral-400 mt-1">Ready to donate 450 ml</p>
            </div>

            <button
              onClick={handleStartDonation}
              disabled={isDonating}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                isDonating
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/40 hover:shadow-red-600/30'
              }`}
            >
              {isDonating ? (
                <>
                  <Activity className="w-5 h-5 animate-spin" /> Transferring Blood ({progress.toFixed(0)}%)
                </>
              ) : (
                <>
                  <Droplet className="w-5 h-5 fill-current" /> Start Donation Simulation
                </>
              )}
            </button>
          </div>

          {/* Center Animated Blood Vessel Drip Cable */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center py-4 relative">
            {/* Horizontal/Vertical Blood Vessel Cable */}
            <div className="relative w-full h-16 md:h-24 flex items-center justify-center">
              
              {/* Vessel Track */}
              <div className="w-full h-4 bg-neutral-950 rounded-full border border-neutral-800 overflow-hidden relative">
                
                {/* Animated Pulsing Blood Liquid Flow */}
                <div 
                  className="h-full transition-all duration-150 rounded-full"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: activeDetail.color,
                    boxShadow: `0 0 12px ${activeDetail.color}`,
                  }}
                />

                {/* Animated Flow Drops inside vessel */}
                {isDonating && (
                  <div className="absolute inset-0 flex items-center justify-around">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span className="w-2 h-2 rounded-full bg-white animate-ping delay-100" />
                    <span className="w-2 h-2 rounded-full bg-white animate-ping delay-200" />
                  </div>
                )}
              </div>

              {/* Status Badge in Center */}
              <div className="absolute bg-neutral-950 border border-neutral-700 px-3 py-1 rounded-full text-xs font-semibold text-neutral-300 shadow-md flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                {isDonating ? 'Transfusion in Progress...' : 'Ready to Connect'}
              </div>
            </div>

            <div className="text-center space-y-1 mt-2">
              <span className="text-xs text-neutral-400">Component Shelf Life</span>
              <p className="text-sm font-bold text-white flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> {activeDetail.shelfLife}
              </p>
            </div>
          </div>

          {/* Right Recipient Impact Unit */}
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
            
            {/* Recipient Blood Bag */}
            <div className="relative w-32 h-44 bg-neutral-950 rounded-2xl border-2 border-neutral-700 p-2 flex flex-col justify-between overflow-hidden shadow-inner">
              
              {/* Blood Bag Hanger */}
              <div className="w-8 h-2 bg-neutral-800 rounded-full mx-auto" />

              {/* Liquid Fill inside Blood Bag */}
              <div 
                className="absolute bottom-0 left-0 right-0 transition-all duration-300 rounded-b-xl"
                style={{
                  height: `${progress}%`,
                  backgroundColor: activeDetail.color,
                  boxShadow: `0 -4px 15px ${activeDetail.color}`,
                }}
              />

              {/* Bag Label overlay */}
              <div className="relative z-10 bg-neutral-900/90 border border-neutral-700/80 rounded-lg p-2 text-center text-xs">
                <span className="font-bold text-white block">{activeDetail.title}</span>
                <span className="text-[10px] text-neutral-400">450 mL Unit #{unitsDonated}</span>
              </div>

              <div className="relative z-10 text-[10px] font-bold text-white text-center pb-1">
                {progress > 0 ? `${progress.toFixed(0)}% Filled` : 'Empty Bag'}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Lives Saved Impact</span>
              <h3 className="text-2xl font-black text-white mt-0.5">
                {(unitsDonated * 3).toLocaleString()} Lives Impacted
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs leading-relaxed">
                {activeDetail.description}
              </p>
            </div>

            {/* Success Check Pill */}
            {!isDonating && progress === 0 && unitsDonated > 1 && (
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-full font-medium animate-pulse">
                <CheckCircle2 className="w-4 h-4" /> Donation Complete! 3 Lives Saved
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
