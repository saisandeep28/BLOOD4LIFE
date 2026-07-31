'use client';

import React, { useState } from 'react';
import { Droplet, Building2, MapPin, X, Phone, Navigation, Search, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface DistrictData {
  id: string;
  name: string;
  code: string;
  donors: number;
  centers: number;
  camps: number;
  path: string;
  cx: number;
  cy: number;
  labelX: number;
  labelY: number;
  bloodBanks: Array<{
    name: string;
    address: string;
    contact: string;
    category: 'Government' | 'Red Cross' | 'Private' | 'Charitable';
    stock: { Apos: number; Bpos: number; Opos: number; ABpos: number; Oneg: number };
  }>;
}

export const AP_DISTRICTS_DATA: DistrictData[] = [
  {
    id: 'srikakulam',
    name: 'Srikakulam',
    code: 'SKL',
    donors: 4820,
    centers: 12,
    camps: 45,
    cx: 480,
    cy: 70,
    labelX: 480,
    labelY: 55,
    path: 'M 440,85 Q 460,50 495,45 Q 520,60 510,95 Q 475,105 440,85 Z',
    bloodBanks: [
      { name: 'RIMS District Blood Bank', address: 'RIMS Hospital Campus, Srikakulam', contact: '08942-227788', category: 'Government', stock: { Apos: 24, Bpos: 38, Opos: 50, ABpos: 12, Oneg: 4 } },
      { name: 'Indian Red Cross Society Blood Bank', address: 'Near Seven Road Junction, Srikakulam', contact: '08942-223400', category: 'Red Cross', stock: { Apos: 18, Bpos: 29, Opos: 42, ABpos: 8, Oneg: 2 } },
    ],
  },
  {
    id: 'vizianagaram',
    name: 'Vizianagaram',
    code: 'VZM',
    donors: 5640,
    centers: 14,
    camps: 52,
    cx: 430,
    cy: 110,
    labelX: 430,
    labelY: 95,
    path: 'M 395,120 Q 420,80 445,85 Q 475,105 460,135 Q 415,145 395,120 Z',
    bloodBanks: [
      { name: 'Government General Hospital Blood Bank', address: 'GGH Road, Vizianagaram', contact: '08922-227466', category: 'Government', stock: { Apos: 31, Bpos: 45, Opos: 62, ABpos: 15, Oneg: 6 } },
      { name: 'Maharajah Hospital Blood Bank', address: 'Fort Road, Vizianagaram', contact: '08922-231122', category: 'Charitable', stock: { Apos: 14, Bpos: 20, Opos: 33, ABpos: 7, Oneg: 3 } },
    ],
  },
  {
    id: 'visakhapatnam',
    name: 'Visakhapatnam',
    code: 'VSP',
    donors: 18950,
    centers: 42,
    camps: 180,
    cx: 410,
    cy: 160,
    labelX: 410,
    labelY: 178,
    path: 'M 365,150 Q 410,135 460,135 Q 440,185 390,195 Q 360,175 365,150 Z',
    bloodBanks: [
      { name: 'King George Hospital (KGH) Regional Blood Bank', address: 'Maharanipeta, Visakhapatnam', contact: '0891-2564888', category: 'Government', stock: { Apos: 85, Bpos: 110, Opos: 140, ABpos: 35, Oneg: 12 } },
      { name: 'GITAM Institute of Medical Sciences Blood Bank', address: 'Rushikonda, Visakhapatnam', contact: '0891-2840500', category: 'Private', stock: { Apos: 40, Bpos: 55, Opos: 78, ABpos: 22, Oneg: 8 } },
      { name: 'ASR Voluntary Blood Bank', address: 'Dondaparthy, Visakhapatnam', contact: '0891-2754321', category: 'Charitable', stock: { Apos: 28, Bpos: 36, Opos: 50, ABpos: 10, Oneg: 4 } },
    ],
  },
  {
    id: 'east_godavari',
    name: 'East Godavari (Kakinada)',
    code: 'EG',
    donors: 12400,
    centers: 28,
    camps: 115,
    cx: 345,
    cy: 215,
    labelX: 345,
    labelY: 232,
    path: 'M 315,195 Q 365,185 390,195 Q 375,245 325,240 Q 305,215 315,195 Z',
    bloodBanks: [
      { name: 'GGH Kakinada Central Blood Bank', address: 'Main Road, Kakinada', contact: '0884-2367355', category: 'Government', stock: { Apos: 52, Bpos: 68, Opos: 90, ABpos: 24, Oneg: 7 } },
      { name: 'Rangaraya Medical College Blood Bank', address: 'Pithapuram Road, Kakinada', contact: '0884-2374411', category: 'Government', stock: { Apos: 34, Bpos: 48, Opos: 65, ABpos: 16, Oneg: 5 } },
    ],
  },
  {
    id: 'west_godavari',
    name: 'West Godavari (Eluru)',
    code: 'WG',
    donors: 9800,
    centers: 22,
    camps: 92,
    cx: 285,
    cy: 250,
    labelX: 285,
    labelY: 268,
    path: 'M 255,235 Q 315,225 325,240 Q 300,285 245,275 Q 240,250 255,235 Z',
    bloodBanks: [
      { name: 'District Hospital Blood Bank', address: 'GGH Eluru Campus, Eluru', contact: '08812-232788', category: 'Government', stock: { Apos: 38, Bpos: 50, Opos: 72, ABpos: 18, Oneg: 5 } },
      { name: 'ASRAM Medical College Blood Bank', address: 'Malkapuram, Eluru', contact: '08812-288200', category: 'Private', stock: { Apos: 25, Bpos: 32, Opos: 48, ABpos: 11, Oneg: 3 } },
    ],
  },
  {
    id: 'krishna',
    name: 'Krishna (Vijayawada)',
    code: 'KRS',
    donors: 16800,
    centers: 36,
    camps: 145,
    cx: 225,
    cy: 290,
    labelX: 225,
    labelY: 308,
    path: 'M 195,275 Q 255,265 265,285 Q 240,325 185,315 Q 180,290 195,275 Z',
    bloodBanks: [
      { name: 'GGH Vijayawada Apex Blood Center', address: 'Gunadala, Vijayawada', contact: '0866-2578888', category: 'Government', stock: { Apos: 75, Bpos: 98, Opos: 130, ABpos: 32, Oneg: 10 } },
      { name: 'Rotary Red Cross Voluntary Blood Bank', address: 'MG Road, Vijayawada', contact: '0866-2495300', category: 'Red Cross', stock: { Apos: 42, Bpos: 60, Opos: 85, ABpos: 20, Oneg: 6 } },
      { name: 'Ayush Blood Center', address: 'Governorpet, Vijayawada', contact: '0866-2571234', category: 'Private', stock: { Apos: 30, Bpos: 40, Opos: 58, ABpos: 14, Oneg: 4 } },
    ],
  },
  {
    id: 'guntur',
    name: 'Guntur',
    code: 'GNT',
    donors: 14200,
    centers: 30,
    camps: 125,
    cx: 175,
    cy: 345,
    labelX: 175,
    labelY: 362,
    path: 'M 140,325 Q 195,315 210,335 Q 185,385 130,370 Q 125,345 140,325 Z',
    bloodBanks: [
      { name: 'Government General Hospital Blood Bank', address: 'Kothapet, Guntur', contact: '0863-2234445', category: 'Government', stock: { Apos: 60, Bpos: 82, Opos: 110, ABpos: 26, Oneg: 8 } },
      { name: 'NRI Academy Medical Sciences Blood Bank', address: 'Chinakakani, Guntur', contact: '0863-2340100', category: 'Private', stock: { Apos: 35, Bpos: 46, Opos: 68, ABpos: 17, Oneg: 5 } },
    ],
  },
  {
    id: 'prakasam',
    name: 'Prakasam (Ongole)',
    code: 'PRK',
    donors: 8900,
    centers: 20,
    camps: 80,
    cx: 135,
    cy: 410,
    labelX: 135,
    labelY: 428,
    path: 'M 100,385 Q 160,375 170,400 Q 145,455 90,440 Q 85,410 100,385 Z',
    bloodBanks: [
      { name: 'RIMS Ongole Blood Bank', address: 'Kurnool Road, Ongole', contact: '08592-232777', category: 'Government', stock: { Apos: 32, Bpos: 44, Opos: 60, ABpos: 14, Oneg: 4 } },
      { name: 'Ongole Voluntary Blood Bank', address: 'Trunk Road, Ongole', contact: '08592-231990', category: 'Charitable', stock: { Apos: 18, Bpos: 25, Opos: 38, ABpos: 9, Oneg: 2 } },
    ],
  },
  {
    id: 'nellore',
    name: 'Sri Potti Sriramulu Nellore',
    code: 'NLR',
    donors: 10500,
    centers: 24,
    camps: 95,
    cx: 145,
    cy: 485,
    labelX: 145,
    labelY: 503,
    path: 'M 105,460 Q 165,450 175,475 Q 155,530 95,515 Q 90,485 105,460 Z',
    bloodBanks: [
      { name: 'Government General Hospital Blood Bank', address: 'Dargamitta, Nellore', contact: '0861-2316400', category: 'Government', stock: { Apos: 45, Bpos: 58, Opos: 80, ABpos: 19, Oneg: 6 } },
      { name: 'Narayana Medical College Blood Bank', address: 'Chinthareddypalem, Nellore', contact: '0861-2317900', category: 'Private', stock: { Apos: 38, Bpos: 49, Opos: 67, ABpos: 16, Oneg: 5 } },
    ],
  },
  {
    id: 'chittoor',
    name: 'Chittoor / Tirupati',
    code: 'CTR',
    donors: 15600,
    centers: 34,
    camps: 140,
    cx: 110,
    cy: 560,
    labelX: 110,
    labelY: 578,
    path: 'M 65,535 Q 130,525 140,555 Q 115,605 50,590 Q 45,560 65,535 Z',
    bloodBanks: [
      { name: 'SVRR Government General Hospital Blood Bank', address: 'Alipiri Road, Tirupati', contact: '0877-2237221', category: 'Government', stock: { Apos: 70, Bpos: 92, Opos: 125, ABpos: 30, Oneg: 9 } },
      { name: 'Sri Padmavathi Medical College Blood Bank', address: 'SVIMS Campus, Tirupati', contact: '0877-2287777', category: 'Government', stock: { Apos: 48, Bpos: 62, Opos: 88, ABpos: 21, Oneg: 7 } },
      { name: 'Red Cross Society Blood Bank', address: 'Gandhi Road, Chittoor', contact: '08572-232100', category: 'Red Cross', stock: { Apos: 24, Bpos: 32, Opos: 45, ABpos: 10, Oneg: 3 } },
    ],
  },
  {
    id: 'kadapa',
    name: 'YSR Kadapa',
    code: 'KDP',
    donors: 8400,
    centers: 18,
    camps: 75,
    cx: 90,
    cy: 480,
    labelX: 90,
    labelY: 495,
    path: 'M 45,450 Q 100,440 110,465 Q 85,515 35,500 Q 30,470 45,450 Z',
    bloodBanks: [
      { name: 'RIMS Hospital Blood Bank', address: 'RIMS Campus, Kadapa', contact: '08562-245100', category: 'Government', stock: { Apos: 36, Bpos: 48, Opos: 64, ABpos: 15, Oneg: 4 } },
      { name: 'Fathima Institute of Medical Sciences Blood Bank', address: 'Ramarajupalli, Kadapa', contact: '08562-200300', category: 'Private', stock: { Apos: 20, Bpos: 28, Opos: 40, ABpos: 9, Oneg: 3 } },
    ],
  },
  {
    id: 'anantapur',
    name: 'Anantapur',
    code: 'ATP',
    donors: 9200,
    centers: 22,
    camps: 88,
    cx: 50,
    cy: 420,
    labelX: 50,
    labelY: 435,
    path: 'M 15,390 Q 75,380 85,405 Q 60,455 10,440 Q 5,410 15,390 Z',
    bloodBanks: [
      { name: 'Government General Hospital Blood Bank', address: 'Rahmath Nagar, Anantapur', contact: '08554-274344', category: 'Government', stock: { Apos: 40, Bpos: 54, Opos: 75, ABpos: 18, Oneg: 5 } },
      { name: 'Sri Sathya Sai Super Speciality Hospital Blood Bank', address: 'Prasanthigram, Puttaparthi', contact: '08555-287388', category: 'Charitable', stock: { Apos: 28, Bpos: 36, Opos: 50, ABpos: 12, Oneg: 4 } },
    ],
  },
  {
    id: 'kurnool',
    name: 'Kurnool',
    code: 'KRN',
    donors: 11200,
    centers: 26,
    camps: 102,
    cx: 60,
    cy: 350,
    labelX: 60,
    labelY: 335,
    path: 'M 20,320 Q 85,310 95,335 Q 70,385 15,370 Q 10,340 20,320 Z',
    bloodBanks: [
      { name: 'Kurnool Medical College & GGH Blood Center', address: 'Budhawarapet, Kurnool', contact: '08518-222777', category: 'Government', stock: { Apos: 55, Bpos: 72, Opos: 98, ABpos: 25, Oneg: 7 } },
      { name: 'Viswabharathi Super Speciality Blood Bank', address: 'Gayatri Estate, Kurnool', contact: '08518-278900', category: 'Private', stock: { Apos: 30, Bpos: 42, Opos: 56, ABpos: 14, Oneg: 4 } },
    ],
  },
];

export function APInteractiveMap() {
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictData | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const activeDistrict = hoveredDistrict || selectedDistrict;

  const filteredDistricts = AP_DISTRICTS_DATA.filter(d => 
    d.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
    d.code.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="w-full space-y-6">
      {/* Search & Quick Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search district in Andhra Pradesh..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full h-9 pl-9 pr-4 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          <span className="text-neutral-500 font-medium shrink-0">Quick Select:</span>
          {['Visakhapatnam', 'Krishna', 'Chittoor', 'Guntur', 'Kurnool'].map(name => (
            <button
              key={name}
              onClick={() => {
                const found = AP_DISTRICTS_DATA.find(d => d.name.toLowerCase().includes(name.toLowerCase()));
                if (found) setSelectedDistrict(found);
              }}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-brand hover:text-brand font-semibold shrink-0 transition-colors"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive SVG Map */}
        <div className="lg:col-span-7 bg-gradient-to-br from-red-950/5 via-neutral-900/5 to-red-900/10 dark:from-neutral-900 dark:to-neutral-950 p-6 rounded-2xl border border-brand/20 relative shadow-inner overflow-hidden min-h-[500px] flex flex-col items-center justify-center">
          
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
            Live State Vector Map • Andhra Pradesh
          </div>

          <div className="relative w-full max-w-[500px] aspect-[500/620]">
            <svg
              viewBox="0 0 550 630"
              className="w-full h-full filter drop-shadow-xl"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="districtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b0000" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#b30000" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="hoverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* District Paths */}
              {AP_DISTRICTS_DATA.map((district) => {
                const isSelected = selectedDistrict?.id === district.id;
                const isHovered = hoveredDistrict?.id === district.id;

                return (
                  <g key={district.id} className="cursor-pointer transition-all duration-300">
                    <path
                      d={district.path}
                      fill={isSelected ? 'url(#hoverGradient)' : isHovered ? '#ef4444' : 'url(#districtGradient)'}
                      stroke={isSelected ? '#ffffff' : isHovered ? '#fef08a' : '#ffffff'}
                      strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                      opacity={isSelected || isHovered ? 1 : 0.88}
                      filter={isSelected || isHovered ? 'url(#glow)' : undefined}
                      onMouseEnter={() => setHoveredDistrict(district)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                      onClick={() => setSelectedDistrict(district)}
                      className="transition-all duration-200 hover:scale-[1.02] transform-origin-center"
                    />

                    {/* District Pulse Center Marker */}
                    <g transform={`translate(${district.cx}, ${district.cy})`} pointerEvents="none">
                      <circle
                        r={isSelected ? 7 : isHovered ? 6 : 4}
                        fill={isSelected ? '#ffffff' : '#fef08a'}
                        className={isSelected || isHovered ? 'animate-pulse' : ''}
                      />
                      {(isSelected || isHovered) && (
                        <circle
                          r={12}
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          className="animate-ping opacity-75"
                        />
                      )}
                    </g>

                    {/* District Code Label */}
                    <text
                      x={district.labelX}
                      y={district.labelY}
                      fill="#ffffff"
                      fontSize={isSelected ? "12" : isHovered ? "11" : "10"}
                      fontWeight="bold"
                      textAnchor="middle"
                      pointerEvents="none"
                      className="drop-shadow-md select-none transition-all"
                    >
                      {district.code}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-4 text-center text-xs text-neutral-500 font-medium">
            💡 <span className="text-brand font-semibold">Click or hover</span> any district on the map to view real-time blood banks & inventory.
          </div>
        </div>

        {/* Right Info Panel & Blood Banks Drawer */}
        <div className="lg:col-span-5 space-y-4">
          {activeDistrict ? (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-brand/20 p-6 shadow-xl space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <div>
                  <span className="bg-brand/10 text-brand text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-brand/20 uppercase tracking-wider">
                    {activeDistrict.code} District
                  </span>
                  <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-1">
                    {activeDistrict.name}
                  </h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setSelectedDistrict(null); setHoveredDistrict(null); }}
                  className="h-8 w-8 p-0 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <X className="w-4 h-4 text-neutral-500" />
                </Button>
              </div>

              {/* District Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-xl border border-neutral-200/60 dark:border-neutral-800">
                  <p className="text-[11px] text-neutral-500 font-medium">Registered Donors</p>
                  <p className="text-lg font-bold text-brand">{activeDistrict.donors.toLocaleString()}</p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-xl border border-neutral-200/60 dark:border-neutral-800">
                  <p className="text-[11px] text-neutral-500 font-medium">Blood Centers</p>
                  <p className="text-lg font-bold text-neutral-800 dark:text-neutral-200">{activeDistrict.centers}</p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-xl border border-neutral-200/60 dark:border-neutral-800">
                  <p className="text-[11px] text-neutral-500 font-medium">Active Camps</p>
                  <p className="text-lg font-bold text-amber-600">{activeDistrict.camps}</p>
                </div>
              </div>

              {/* List of Blood Banks in District */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-brand" />
                  Available Blood Centers ({activeDistrict.bloodBanks.length})
                </h4>

                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {activeDistrict.bloodBanks.map((bank, idx) => (
                    <div 
                      key={idx} 
                      className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 hover:border-brand/40 transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">{bank.name}</h5>
                          <p className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-brand shrink-0" />
                            {bank.address}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand/10 text-brand shrink-0">
                          {bank.category}
                        </span>
                      </div>

                      {/* Stock breakdown */}
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-neutral-400 font-medium mr-1">Stock:</span>
                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                          A+ ({bank.stock.Apos})
                        </span>
                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                          B+ ({bank.stock.Bpos})
                        </span>
                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                          O+ ({bank.stock.Opos})
                        </span>
                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                          AB+ ({bank.stock.ABpos})
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-neutral-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-brand" /> {bank.contact}
                        </span>
                        <a 
                          href={`tel:${bank.contact}`} 
                          className="text-brand font-semibold hover:underline flex items-center gap-0.5 text-[11px]"
                        >
                          Call Center <ChevronRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 p-8 text-center flex flex-col items-center justify-center min-h-[350px] space-y-4">
              <div className="w-14 h-14 rounded-full bg-brand/10 text-brand flex items-center justify-center animate-bounce">
                <MapPin className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">Select a District on the Map</h4>
                <p className="text-xs text-neutral-500 max-w-xs mt-1">
                  Hover or click any district path on the vector map to inspect live blood bank directories, contact details, and component stocks.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
