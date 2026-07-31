'use client';

import { useState } from 'react';

export interface APDistrictMapProps {
  hoveredDistrict: string | null;
  selectedDistrict: string | null;
  onHover: (district: string | null) => void;
  onClick: (district: string) => void;
}

// Approximate district boundaries for Andhra Pradesh (13 districts)
// ViewBox: 0 0 500 700  — coordinates are simplified but geographically proportional
const DISTRICT_PATHS: { id: string; label: string; labelX: number; labelY: number; path: string }[] = [
  {
    id: "Srikakulam",
    label: "Srikakulam",
    labelX: 390,
    labelY: 60,
    path: "M 345,15 L 420,10 L 455,30 L 460,65 L 440,85 L 415,90 L 385,75 L 360,55 L 355,30 Z"
  },
  {
    id: "Vizianagaram",
    label: "Vizianagaram",
    labelX: 340,
    labelY: 90,
    path: "M 295,45 L 345,15 L 360,55 L 385,75 L 380,105 L 355,115 L 320,110 L 295,90 Z"
  },
  {
    id: "Visakhapatnam",
    label: "Visakhapatnam",
    labelX: 405,
    labelY: 130,
    path: "M 385,75 L 415,90 L 440,85 L 460,65 L 468,105 L 460,140 L 440,160 L 415,165 L 390,150 L 370,130 L 375,105 L 380,105 L 355,115 Z"
  },
  {
    id: "East Godavari",
    label: "E. Godavari",
    labelX: 385,
    labelY: 205,
    path: "M 355,115 L 380,105 L 375,105 L 390,150 L 415,165 L 440,160 L 460,140 L 470,175 L 455,215 L 430,235 L 405,240 L 375,230 L 345,210 L 330,185 L 335,155 L 350,135 Z"
  },
  {
    id: "West Godavari",
    label: "W. Godavari",
    labelX: 295,
    labelY: 190,
    path: "M 250,140 L 295,90 L 320,110 L 355,115 L 350,135 L 335,155 L 330,185 L 310,200 L 280,210 L 255,205 L 235,185 L 240,160 Z"
  },
  {
    id: "Krishna",
    label: "Krishna",
    labelX: 310,
    labelY: 255,
    path: "M 255,205 L 280,210 L 310,200 L 330,185 L 345,210 L 375,230 L 405,240 L 405,265 L 380,285 L 345,290 L 315,280 L 285,270 L 260,250 L 250,230 Z"
  },
  {
    id: "Guntur",
    label: "Guntur",
    labelX: 250,
    labelY: 290,
    path: "M 195,215 L 250,140 L 240,160 L 235,185 L 255,205 L 250,230 L 260,250 L 260,275 L 240,300 L 215,305 L 185,295 L 175,265 L 180,240 Z"
  },
  {
    id: "Prakasam",
    label: "Prakasam",
    labelX: 280,
    labelY: 360,
    path: "M 175,265 L 185,295 L 215,305 L 240,300 L 260,275 L 285,270 L 315,280 L 345,290 L 380,285 L 395,310 L 385,360 L 360,400 L 320,415 L 280,410 L 240,395 L 210,370 L 190,335 L 175,300 Z"
  },
  {
    id: "Nellore",
    label: "Nellore",
    labelX: 320,
    labelY: 470,
    path: "M 240,395 L 280,410 L 320,415 L 360,400 L 385,360 L 415,370 L 425,415 L 415,460 L 390,490 L 355,510 L 315,505 L 275,485 L 250,455 L 240,420 Z"
  },
  {
    id: "Chittoor",
    label: "Chittoor",
    labelX: 245,
    labelY: 545,
    path: "M 180,470 L 210,445 L 240,455 L 250,485 L 275,485 L 315,505 L 315,545 L 290,575 L 255,585 L 215,570 L 185,545 L 170,510 Z"
  },
  {
    id: "Kadapa",
    label: "Kadapa",
    labelX: 195,
    labelY: 450,
    path: "M 130,345 L 170,320 L 190,335 L 210,370 L 240,395 L 240,420 L 210,445 L 180,470 L 150,460 L 125,430 L 115,395 L 120,360 Z"
  },
  {
    id: "Anantapur",
    label: "Anantapur",
    labelX: 105,
    labelY: 435,
    path: "M 55,310 L 100,280 L 130,345 L 120,360 L 115,395 L 125,430 L 110,465 L 75,470 L 45,445 L 35,400 L 45,355 L 50,320 Z"
  },
  {
    id: "Kurnool",
    label: "Kurnool",
    labelX: 130,
    labelY: 300,
    path: "M 80,190 L 140,165 L 175,195 L 195,215 L 180,240 L 175,265 L 160,295 L 130,320 L 100,280 L 80,260 L 65,225 L 70,205 Z"
  },
];

export default function APDistrictMap({ hoveredDistrict, selectedDistrict, onHover, onClick }: APDistrictMapProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string } | null>(null);

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox="0 0 510 620"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        style={{ maxHeight: '500px' }}
        onMouseLeave={() => { onHover(null); setTooltip(null); }}
      >
        <defs>
          <filter id="district-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.25" />
          </filter>
        </defs>

        {DISTRICT_PATHS.map((district) => {
          const isHovered = hoveredDistrict === district.id;
          const isSelected = selectedDistrict === district.id;
          const isActive = isHovered || isSelected;

          return (
            <g key={district.id}>
              <path
                d={district.path}
                fill={isActive ? '#f19fb1' : '#d9d9d9'}
                stroke="#fff"
                strokeWidth={isActive ? "1.5" : "1"}
                style={{
                  cursor: 'pointer',
                  transition: 'fill 0.2s ease',
                  filter: isActive ? 'url(#district-shadow)' : 'none'
                }}
                onMouseEnter={(e) => {
                  onHover(district.id);
                  const svgEl = (e.currentTarget as SVGPathElement).ownerSVGElement;
                  if (!svgEl) return;
                  const rect = svgEl.getBoundingClientRect();
                  const svgRect = svgEl.viewBox.baseVal;
                  const scaleX = svgRect.width / rect.width;
                  const scaleY = svgRect.height / rect.height;
                  const rawX = (e.clientX - rect.left) * scaleX;
                  const rawY = (e.clientY - rect.top) * scaleY;
                  setTooltip({ x: rawX, y: rawY, name: district.id });
                }}
                onMouseMove={(e) => {
                  const svgEl = (e.currentTarget as SVGPathElement).ownerSVGElement;
                  if (!svgEl) return;
                  const rect = svgEl.getBoundingClientRect();
                  const svgRect = svgEl.viewBox.baseVal;
                  const scaleX = svgRect.width / rect.width;
                  const scaleY = svgRect.height / rect.height;
                  const rawX = (e.clientX - rect.left) * scaleX;
                  const rawY = (e.clientY - rect.top) * scaleY;
                  setTooltip({ x: rawX, y: rawY, name: district.id });
                }}
                onMouseLeave={() => { onHover(null); setTooltip(null); }}
                onClick={() => onClick(district.id)}
              />
            </g>
          );
        })}

        {/* District name labels (always shown) */}
        {DISTRICT_PATHS.map((district) => (
          <text
            key={`label-${district.id}`}
            x={district.labelX}
            y={district.labelY}
            textAnchor="middle"
            fontSize="8"
            fontWeight="600"
            fill={hoveredDistrict === district.id || selectedDistrict === district.id ? '#8b0000' : '#555555'}
            style={{ pointerEvents: 'none', userSelect: 'none', transition: 'fill 0.2s' }}
          >
            {district.label}
          </text>
        ))}

        {/* Tooltip bubble following mouse */}
        {tooltip && hoveredDistrict && (
          <g>
            {/* Tooltip box */}
            <rect
              x={tooltip.x + 8}
              y={tooltip.y - 22}
              width={tooltip.name.length * 7 + 16}
              height={28}
              rx="4"
              fill="white"
              stroke="#d1d5db"
              strokeWidth="0.8"
              style={{ filter: 'drop-shadow(1px 2px 4px rgba(0,0,0,0.18))' }}
            />
            {/* Left arrow pointer */}
            <polygon
              points={`${tooltip.x + 8},${tooltip.y - 8} ${tooltip.x + 2},${tooltip.y} ${tooltip.x + 8},${tooltip.y + 8}`}
              fill="white"
              stroke="#d1d5db"
              strokeWidth="0.6"
            />
            <rect
              x={tooltip.x + 8}
              y={tooltip.y - 8}
              width={8}
              height={16}
              fill="white"
            />
            {/* District name text */}
            <text
              x={tooltip.x + 16}
              y={tooltip.y - 5}
              fontSize="10"
              fontWeight="700"
              fill="#8b0000"
              style={{ pointerEvents: 'none' }}
            >
              {tooltip.name}
            </text>
            <text
              x={tooltip.x + 16}
              y={tooltip.y + 8}
              fontSize="8"
              fill="#6b7280"
              style={{ pointerEvents: 'none' }}
            >
              Andhra Pradesh
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
