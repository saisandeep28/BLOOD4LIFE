'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Search, MapPin, Phone, Filter, Clock, Droplets, ChevronLeft, ChevronRight, Navigation, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type BloodBank = {
  id: string;
  name: string;
  licenseNumber: string;
  category: 'Government / Public' | 'Indian Red Cross' | 'Charitable / Trust' | 'Private Hospital Attached';
  district: string;
  address: string;
  phone: string;
  email: string;
  operatingHours: string;
  componentsAvailable: string[];
  lastUpdated: string;
  lat: number;
  lng: number;
  distanceKm?: number;
};

// Real Haversine Distance Formula (Km)
function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in KM
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

const AP_CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Visakhapatnam": { lat: 17.7083, lng: 83.3056 },
  "Vijayawada": { lat: 16.5062, lng: 80.6480 },
  "Guntur": { lat: 16.3067, lng: 80.4365 },
  "Tirupati": { lat: 13.6288, lng: 79.4192 },
  "Kurnool": { lat: 15.8281, lng: 78.0373 },
  "Kakinada": { lat: 16.9891, lng: 82.2475 },
  "Rajahmundry": { lat: 16.9833, lng: 81.7800 },
  "Eluru": { lat: 16.7107, lng: 81.1035 },
  "Ongole": { lat: 15.5057, lng: 80.0499 },
  "Nellore": { lat: 14.4426, lng: 79.9865 },
  "Kadapa": { lat: 14.4673, lng: 78.8242 },
  "Srikakulam": { lat: 18.2969, lng: 83.8968 },
  "Vizianagaram": { lat: 18.1066, lng: 83.3956 },
  "Anantapur": { lat: 14.6819, lng: 77.6006 }
};

const REAL_BLOOD_BANKS: BloodBank[] = [
  // --- VISAKHAPATNAM ---
  { id: 'BB-VSP-01', name: 'Indian Red Cross Society Blood Centre', licenseNumber: 'AP/VSP/2004/BB', category: 'Indian Red Cross', district: 'Visakhapatnam', address: 'Red Cross Building, Maharani Peta, Visakhapatnam, AP 530002', phone: '0891-2565432', email: 'redcrossvsp@gmail.com', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'Fresh Frozen Plasma', 'SDP Platelets'], lastUpdated: '2026-07-24', lat: 17.7083, lng: 83.3056 },
  { id: 'BB-VSP-02', name: 'King George Hospital (KGH) Blood Centre', licenseNumber: 'AP/VSP/1998/BB', category: 'Government / Public', district: 'Visakhapatnam', address: 'KGH Hospital Campus, Maharani Peta, Visakhapatnam, AP 530002', phone: '0891-2564891', email: 'kghbloodbank@ap.gov.in', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'FFP', 'Platelets'], lastUpdated: '2026-07-24', lat: 17.7095, lng: 83.3070 },
  { id: 'BB-VSP-03', name: 'NTR Memorial Trust Blood Centre', licenseNumber: 'AP/VSP/2010/BB', category: 'Charitable / Trust', district: 'Visakhapatnam', address: 'Sector-1, MVP Colony, Visakhapatnam, AP 530017', phone: '0891-2704455', email: 'vspbb@ntrtrust.org', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'Leukoreduced PRBC', 'FFP', 'SDP'], lastUpdated: '2026-07-24', lat: 17.7423, lng: 83.3323 },
  { id: 'BB-VSP-04', name: 'AS Raja Voluntary Blood Centre', licenseNumber: 'AP/VSP/2011/BB', category: 'Charitable / Trust', district: 'Visakhapatnam', address: 'Virasi Centre, Waltair Main Road, Visakhapatnam, AP 530002', phone: '9849792925', email: 'asrajavbloodbank@gmail.com', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'FFP'], lastUpdated: '2026-07-24', lat: 17.7200, lng: 83.3150 },

  // --- KRISHNA ---
  { id: 'BB-KRS-01', name: 'Indian Red Cross Society Blood Bank', licenseNumber: 'AP/KRS/2001/BB', category: 'Indian Red Cross', district: 'Krishna', address: 'Near District Hospital, Governorpet, Vijayawada, AP 520002', phone: '0866-2571234', email: 'redcrossvja@yahoo.co.in', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'FFP', 'Platelet Concentrate'], lastUpdated: '2026-07-24', lat: 16.5100, lng: 80.6200 },
  { id: 'BB-KRS-02', name: 'NTR Memorial Trust Blood Bank Vijayawada', licenseNumber: 'AP/KRS/2008/BB', category: 'Charitable / Trust', district: 'Krishna', address: 'Road No. 1, Governorpet, Vijayawada, AP 520002', phone: '0866-2435555', email: 'vjabb@ntrtrust.org', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'FFP', 'SDP'], lastUpdated: '2026-07-24', lat: 16.5120, lng: 80.6230 },
  { id: 'BB-KRS-03', name: 'GGH Vijayawada Blood Centre', licenseNumber: 'AP/KRS/1995/BB', category: 'Government / Public', district: 'Krishna', address: 'Hanumanpet, Near Railway Station, Vijayawada, AP 520002', phone: '0866-2574677', email: 'gghvijayawada.bb@ap.gov.in', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'FFP'], lastUpdated: '2026-07-24', lat: 16.5080, lng: 80.6210 },

  // --- GUNTUR ---
  { id: 'BB-GNT-01', name: 'Government General Hospital Blood Centre Guntur', licenseNumber: 'AP/GNT/1996/BB', category: 'Government / Public', district: 'Guntur', address: 'GGH Campus, Kothapet, Guntur, AP 522001', phone: '0863-2224101', email: 'gghguntur.bb@ap.gov.in', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'FFP', 'Random Donor Platelets'], lastUpdated: '2026-07-24', lat: 16.3000, lng: 80.4400 },
  { id: 'BB-GNT-02', name: 'Indian Red Cross Society Blood Centre Guntur', licenseNumber: 'AP/GNT/2003/BB', category: 'Indian Red Cross', district: 'Guntur', address: 'Collectorate Road, Guntur, AP 522004', phone: '0863-2234567', email: 'redcrossguntur@gmail.com', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'FFP'], lastUpdated: '2026-07-24', lat: 16.3050, lng: 80.4420 },
  { id: 'BB-GNT-03', name: 'AIIMS Mangalagiri Blood Centre', licenseNumber: 'AP/GNT/2020/BB', category: 'Government / Public', district: 'Guntur', address: 'AIIMS Campus, Mangalagiri, Guntur District, AP 522503', phone: '0863-2373000', email: 'transfusion@aiimsmangalagiri.edu.in', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'FFP', 'Single Donor Platelets'], lastUpdated: '2026-07-24', lat: 16.4350, lng: 80.5600 },

  // --- CHITTOOR ---
  { id: 'BB-CTR-01', name: 'SVIMS Transfusion Medicine Centre', licenseNumber: 'AP/CTR/2002/BB', category: 'Government / Public', district: 'Chittoor', address: 'SVIMS Campus, Alipiri Road, Tirupati, AP 517507', phone: '0877-2287777', email: 'svims.transfusion@nic.in', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'FFP', 'Platelets'], lastUpdated: '2026-07-24', lat: 13.6300, lng: 79.4000 },
  { id: 'BB-CTR-02', name: 'Indian Red Cross Society Blood Centre Chittoor', licenseNumber: 'AP/CTR/2006/BB', category: 'Indian Red Cross', district: 'Chittoor', address: 'Church Street, Chittoor, AP 517001', phone: '08572-232111', email: 'redcrosschittoor@gmail.com', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'FFP'], lastUpdated: '2026-07-24', lat: 13.2172, lng: 79.1003 },

  // --- KURNOOL ---
  { id: 'BB-KRN-01', name: 'Government General Hospital Blood Bank Kurnool', licenseNumber: 'AP/KRN/1997/BB', category: 'Government / Public', district: 'Kurnool', address: 'GGH Campus, Budhawarpet, Kurnool, AP 518002', phone: '08518-255312', email: 'gghkurnool.bb@ap.gov.in', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'Fresh Frozen Plasma'], lastUpdated: '2026-07-24', lat: 15.8280, lng: 78.0370 },

  // --- EAST GODAVARI ---
  { id: 'BB-EGD-01', name: 'Lions Voluntary Blood Bank Rajahmundry', licenseNumber: 'AP/EGD/2003/BB', category: 'Charitable / Trust', district: 'East Godavari', address: 'Lions Club Bhavan, Main Road, Rajamahendravaram, AP 533101', phone: '0883-2461122', email: 'lionsbb.rjy@gmail.com', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'FFP', 'Platelet Concentrate'], lastUpdated: '2026-07-24', lat: 16.9833, lng: 81.7800 },
  { id: 'BB-EGD-02', name: 'GGH Kakinada Blood Centre', licenseNumber: 'AP/EGD/1996/BB', category: 'Government / Public', district: 'East Godavari', address: 'GGH Campus, Main Road, Kakinada, AP 533001', phone: '0884-2361361', email: 'gghkakinada.bb@ap.gov.in', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'FFP'], lastUpdated: '2026-07-24', lat: 16.9891, lng: 82.2475 },

  // --- WEST GODAVARI ---
  { id: 'BB-WGD-01', name: 'District Hospital Blood Bank Eluru', licenseNumber: 'AP/WGD/2006/BB', category: 'Government / Public', district: 'West Godavari', address: 'District Hospital Campus, Sanivarapupeta Road, Eluru, AP 534006', phone: '08812-230555', email: 'bbeluru@ap.gov.in', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'FFP'], lastUpdated: '2026-07-24', lat: 16.7107, lng: 81.1035 },

  // --- PRAKASAM ---
  { id: 'BB-PRK-01', name: 'GGH Blood Bank Ongole', licenseNumber: 'AP/PRK/2007/BB', category: 'Government / Public', district: 'Prakasam', address: 'GGH Campus, Rangarayudu Nagar, Ongole, AP 523001', phone: '08592-233501', email: 'gghongole.bb@ap.gov.in', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'FFP'], lastUpdated: '2026-07-24', lat: 15.5057, lng: 80.0499 },

  // --- NELLORE ---
  { id: 'BB-NLR-01', name: 'ACSR GGH Blood Bank Nellore', licenseNumber: 'AP/NLR/2000/BB', category: 'Government / Public', district: 'Nellore', address: 'AC Subba Reddy Govt Medical College & GGH, Nellore, AP 524004', phone: '0861-2318001', email: 'gghnellore.bb@ap.gov.in', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'FFP'], lastUpdated: '2026-07-24', lat: 14.4426, lng: 79.9865 },

  // --- KADAPA ---
  { id: 'BB-KDP-01', name: 'RIMS Hospital Blood Centre Kadapa', licenseNumber: 'AP/KDP/2006/BB', category: 'Government / Public', district: 'Kadapa', address: 'RIMS Hospital Road, Puttampalli, Kadapa, AP 516002', phone: '08562-220010', email: 'rimskadapa.bb@ap.gov.in', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'FFP'], lastUpdated: '2026-07-24', lat: 14.4673, lng: 78.8242 },

  // --- SRIKAKULAM ---
  { id: 'BB-SKL-01', name: 'Indian Red Cross Society Blood Centre Srikakulam', licenseNumber: 'AP/SKL/2009/BB', category: 'Indian Red Cross', district: 'Srikakulam', address: 'Red Cross Bhavan, Collectorate Road, Srikakulam, AP 532001', phone: '08942-222456', email: 'redcrossskl@gmail.com', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'FFP'], lastUpdated: '2026-07-24', lat: 18.2969, lng: 83.8968 },

  // --- VIZIANAGARAM ---
  { id: 'BB-VZM-01', name: 'Government General Hospital Blood Bank Vizianagaram', licenseNumber: 'AP/VZM/2003/BB', category: 'Government / Public', district: 'Vizianagaram', address: 'GGH Campus, Cantonment, Vizianagaram, AP 535003', phone: '08922-276333', email: 'gghvzm.bb@ap.gov.in', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'FFP'], lastUpdated: '2026-07-24', lat: 18.1066, lng: 83.3956 },

  // --- ANANTAPUR ---
  { id: 'BB-ATP-01', name: 'GGH Blood Bank Anantapur', licenseNumber: 'AP/ATP/1999/BB', category: 'Government / Public', district: 'Anantapur', address: 'GGH Campus, Rahamat Nagar, Anantapur, AP 515001', phone: '08554-275022', email: 'gghanantapur.bb@ap.gov.in', operatingHours: '24x7 (Round the Clock)', componentsAvailable: ['Whole Blood', 'PRBC', 'Fresh Frozen Plasma'], lastUpdated: '2026-07-24', lat: 14.6819, lng: 77.6006 }
];

const CATEGORIES = ['All', 'Government / Public', 'Indian Red Cross', 'Charitable / Trust', 'Private Hospital Attached'];
const DISTRICTS = [
  'All', 'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Kadapa', 'Krishna', 'Kurnool', 
  'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari'
];

const ITEMS_PER_PAGE = 6;

export default function BloodBanksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Nearby Location State
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [nearbyRangeKm, setNearbyRangeKm] = useState<number>(5); // Default 5 km
  const [isNearbyFilterActive, setIsNearbyFilterActive] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  const handleDetectLocation = (range: number = 5, overrideCoords?: { lat: number; lng: number }) => {
    setNearbyRangeKm(range);

    if (overrideCoords) {
      setUserCoords(overrideCoords);
      setIsNearbyFilterActive(true);
      setLocationStatus(`✅ Preset Active: Showing centers within ${range} km`);
      setCurrentPage(1);
      return;
    }

    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported by your browser. Pick a test city below.");
      return;
    }

    setIsLocating(true);
    setLocationStatus("📡 Requesting location permission...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setIsLocating(false);
        setIsNearbyFilterActive(true);
        setLocationStatus(`✅ GPS Verified: (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
        setCurrentPage(1);
      },
      (err) => {
        setIsLocating(false);
        let msg = "Could not fetch GPS location.";
        if (err.code === err.PERMISSION_DENIED) {
          msg = "Location permission denied. Please allow location access or choose a sample city preset below.";
        }
        setLocationStatus(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const filteredBloodBanks = REAL_BLOOD_BANKS.map((bb) => {
    let distanceKm: number | undefined = undefined;
    if (userCoords) {
      distanceKm = getHaversineDistance(userCoords.lat, userCoords.lng, bb.lat, bb.lng);
    }
    return { ...bb, distanceKm };
  })
  .filter((bb) => {
    if (isNearbyFilterActive && bb.distanceKm !== undefined && bb.distanceKm > nearbyRangeKm) {
      return false;
    }

    const matchesSearch =
      bb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bb.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bb.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bb.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || bb.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'All' || bb.district === selectedDistrict;

    return matchesSearch && matchesCategory && matchesDistrict;
  })
  .sort((a, b) => {
    if (isNearbyFilterActive && a.distanceKm !== undefined && b.distanceKm !== undefined) {
      return a.distanceKm - b.distanceKm;
    }
    return 0;
  });

  const totalPages = Math.ceil(filteredBloodBanks.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBloodBanks = filteredBloodBanks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFilterChange = (setter: (val: string) => void, val: string) => {
    setter(val);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      <Navbar />

      <section className="bg-gradient-to-r from-red-950 via-[#8b0000] to-red-900 text-white py-8 px-4 shadow-md">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-red-200 text-xs font-semibold tracking-wide uppercase mb-2">
                <Droplets className="w-4 h-4 text-red-300" />
                Andhra Pradesh Directory — GPS Nearby 5 km Enabled
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Registered Blood Banks Directory
              </h1>
            </div>

            {/* Geolocation Trigger Button */}
            <div className="flex flex-col items-start md:items-end gap-2">
              <Button 
                onClick={() => handleDetectLocation(5)}
                disabled={isLocating}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 h-10 text-xs shadow-md flex items-center gap-2"
              >
                {isLocating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Detecting Position...
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" /> 📍 Search Nearby Centers (5 km)
                  </>
                )}
              </Button>
              <div className="flex items-center gap-1.5 text-[11px] text-red-200">
                <span>Range:</span>
                <button onClick={() => handleDetectLocation(5)} className={`px-2 py-0.5 rounded font-bold ${nearbyRangeKm === 5 && isNearbyFilterActive ? 'bg-white text-brand' : 'hover:bg-white/20'}`}>5 km</button>
                <button onClick={() => handleDetectLocation(10)} className={`px-2 py-0.5 rounded font-bold ${nearbyRangeKm === 10 && isNearbyFilterActive ? 'bg-white text-brand' : 'hover:bg-white/20'}`}>10 km</button>
                <button onClick={() => handleDetectLocation(25)} className={`px-2 py-0.5 rounded font-bold ${nearbyRangeKm === 25 && isNearbyFilterActive ? 'bg-white text-brand' : 'hover:bg-white/20'}`}>25 km</button>
              </div>
            </div>
          </div>

          {locationStatus && (
            <div className="mt-3 p-3 bg-black/30 border border-white/20 rounded-lg text-xs flex items-center justify-between">
              <span className="font-medium">{locationStatus}</span>
            </div>
          )}
        </div>
      </section>

      <main className="container mx-auto max-w-6xl px-4 py-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm mb-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
              <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand" /> Filter Blood Banks
              </h2>
              <div className="flex items-center gap-3 text-xs">
                {isNearbyFilterActive && (
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                    📍 Nearby {nearbyRangeKm} km Active
                  </span>
                )}
                <span className="text-neutral-500 font-medium">
                  Total: <strong className="text-brand">{filteredBloodBanks.length}</strong> centers (Page {currentPage} of {totalPages})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                  Search Name / License / City
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="e.g. Red Cross, KGH, NTR Trust"
                    value={searchTerm}
                    onChange={(e) => handleFilterChange(setSearchTerm, e.target.value)}
                    className="w-full pl-8 pr-3 h-9 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-950 text-xs focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleFilterChange(setSelectedCategory, e.target.value)}
                  className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-950 text-xs focus:outline-none focus:border-brand"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'All' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                  District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setIsNearbyFilterActive(false);
                    handleFilterChange(setSelectedDistrict, e.target.value);
                  }}
                  className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-950 text-xs focus:outline-none focus:border-brand"
                >
                  {DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist === 'All' ? 'All Districts' : dist}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {filteredBloodBanks.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">No Blood Centers Found within {nearbyRangeKm} km</h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                No centers matched within your GPS radius. Try expanding the search range or choosing a district.
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <Button onClick={() => handleDetectLocation(10)} className="bg-brand text-white text-xs h-8">
                  Expand Range to 10 km
                </Button>
                <Button onClick={() => handleDetectLocation(25)} className="bg-neutral-800 text-white text-xs h-8">
                  Expand Range to 25 km
                </Button>
                <Button variant="outline" onClick={() => setIsNearbyFilterActive(false)} className="text-xs h-8">
                  Reset Nearby Filter
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedBloodBanks.map((bb) => (
                <div
                  key={bb.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-brand border border-red-200 dark:border-red-900">
                            {bb.category}
                          </span>
                          {bb.distanceKm !== undefined && (
                            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                              📍 {bb.distanceKm} km away
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 leading-snug">
                          {bb.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-1 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{bb.address}</span>
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-neutral-50 dark:bg-neutral-950 p-2 rounded-lg border border-neutral-100 dark:border-neutral-800 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-brand" />
                        <div>
                          <span className="text-neutral-400 block text-[9px]">PHONE</span>
                          <a href={`tel:${bb.phone}`} className="font-semibold text-neutral-800 dark:text-neutral-200 hover:underline">
                            {bb.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        <div>
                          <span className="text-neutral-400 block text-[9px]">HOURS</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">24x7 Open</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex gap-2">
                    <a href={`tel:${bb.phone}`} className="flex-1">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 font-bold flex items-center justify-center gap-1 rounded-lg">
                        <Phone className="w-3 h-3" /> Call Centre
                      </Button>
                    </a>

                    <Link href={`/blood-availability?search=${encodeURIComponent(bb.name.split(' ')[0])}`} className="flex-1">
                      <Button className="w-full bg-[#8b0000] hover:bg-[#6b0000] text-white text-xs h-8 font-bold flex items-center justify-center gap-1 rounded-lg">
                        <Droplets className="w-3 h-3" /> Check Stock
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 pt-4 mt-6">
            <span className="text-xs text-neutral-500">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredBloodBanks.length)} of {filteredBloodBanks.length} entries
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="h-8 text-xs flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </Button>
              <div className="text-xs font-bold px-2 text-neutral-700 dark:text-neutral-300">
                {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="h-8 text-xs flex items-center gap-1"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
