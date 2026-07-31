/* cache-reset-2026-07-24 */
'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { InboxIcon, Search, ChevronLeft, ChevronRight, MapPin, Navigation, Compass, AlertCircle, RefreshCw, Calendar, Bell, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- MOCK DATA & GEOLOCATION CONSTANTS ---
const DISTRICTS = [
  "Srikakulam", "Vizianagaram", "Visakhapatnam", "East Godavari", "West Godavari", 
  "Krishna", "Guntur", "Prakasam", "Nellore", "Chittoor", "Kadapa", "Anantapur", "Kurnool"
];

const BLOOD_GROUPS = ["All", "A+ve", "A-Ve", "B+ve", "B-ve", "O+ve", "O-ve", "AB+ve", "AB-ve"];
const COMPONENTS = [
  "Cryo Poor Plasma",
  "Cryoprecipitate",
  "Fresh Frozen Plasma",
  "Irradiated RBC",
  "Leukoreduced Rbc",
  "Packed Red Blood Cells",
  "Plasma",
  "Platelet Concentrate",
  "Platelet Rich Plasma",
  "Random Donor Platelets",
  "Sagm Packed Red Blood Cells",
  "Single Donor Plasma",
  "Single Donor Platelet",
  "Whole Blood"
];

// District & Major City Base Coordinates for Andhra Pradesh
const AP_CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Visakhapatnam": { lat: 17.7083, lng: 83.3056 },
  "Maharanipeta": { lat: 17.7083, lng: 83.3056 },
  "Gajuwaka": { lat: 17.6903, lng: 83.2093 },
  "MVP Colony": { lat: 17.7423, lng: 83.3323 },
  "Pendurthi": { lat: 17.8010, lng: 83.2100 },
  "Anakapalle": { lat: 17.6914, lng: 83.0039 },
  "Bheemunipatnam": { lat: 17.8920, lng: 83.4350 },
  "Seethammadhara": { lat: 17.7380, lng: 83.3100 },
  "Chinagadhili": { lat: 17.7635, lng: 83.3198 },
  "Vijayawada": { lat: 16.5062, lng: 80.6480 },
  "Governorpet": { lat: 16.5100, lng: 80.6200 },
  "Suryaraopet": { lat: 16.5130, lng: 80.6350 },
  "Gunadala": { lat: 16.5250, lng: 80.6600 },
  "Machilipatnam": { lat: 16.1827, lng: 81.1340 },
  "Gudivada": { lat: 16.4352, lng: 80.9984 },
  "Guntur": { lat: 16.3067, lng: 80.4365 },
  "Kothapet": { lat: 16.3000, lng: 80.4400 },
  "Mangalagiri": { lat: 16.4350, lng: 80.5600 },
  "Tenali": { lat: 16.2430, lng: 80.6400 },
  "Tirupati": { lat: 13.6288, lng: 79.4192 },
  "Alipiri": { lat: 13.6300, lng: 79.4000 },
  "Chittoor": { lat: 13.2172, lng: 79.1003 },
  "Madanapalle": { lat: 13.5500, lng: 78.5000 },
  "Kurnool": { lat: 15.8281, lng: 78.0373 },
  "Budhawarpet": { lat: 15.8280, lng: 78.0370 },
  "Nandyal": { lat: 15.4779, lng: 78.4837 },
  "Kakinada": { lat: 16.9891, lng: 82.2475 },
  "Rajahmundry": { lat: 16.9833, lng: 81.7800 },
  "Eluru": { lat: 16.7107, lng: 81.1035 },
  "Bhimavaram": { lat: 16.5449, lng: 81.5212 },
  "Ongole": { lat: 15.5057, lng: 80.0499 },
  "Nellore": { lat: 14.4426, lng: 79.9865 },
  "Kadapa": { lat: 14.4673, lng: 78.8242 },
  "Srikakulam": { lat: 18.2969, lng: 83.8968 },
  "Vizianagaram": { lat: 18.1066, lng: 83.3956 },
  "Anantapur": { lat: 14.6819, lng: 77.6006 }
};

// Real Haversine Distance Formula (Returns Distance in Kilometers)
function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

type BloodBank = {
  id: string;
  name: string;
  district: string;
  category: string;
  inventory: Record<string, number>; 
  lastUpdated: string;
  address: string;
  type: string;
  phone?: string;
  email?: string;
  lat: number;
  lng: number;
  distanceKm?: number;
};

type Camp = {
  id: string;
  date: string;
  name: string;
  district: string;
  contact: string;
  conductedBy: string;
  organisedBy: string;
  time: string;
  venue: string;
};

const MOCK_CAMPS: Camp[] = [
  { 
    id: "1", 
    date: "24-Jul-2026", 
    name: "VBD CAMP", 
    venue: "AREA HOSPITAL , BLOOD STORAGE UNIT ,RAJAM,RAJAM, Vizianagaram", 
    district: "Vizianagaram", 
    contact: "9963117007", 
    conductedBy: "-", 
    organisedBy: "Sri.Ramana", 
    time: "09:30 - 14:30" 
  },
  { 
    id: "2", 
    date: "24-Jul-2026", 
    name: "AIIMS BLOOD DONATION CAMP", 
    venue: "ROOM NO:- G286 IPD BUIDLING AIIMS MANGALAGIRI,MANGALAGIRI, Guntur", 
    district: "Guntur", 
    contact: "6301574870", 
    conductedBy: "All India Institute Of Medical Sciences Blood Centre Mangalagiri", 
    organisedBy: "Aiims Mangalagiri", 
    time: "09:00 - 16:00" 
  }
];

// Generate realistic AP Blood Banks with real coordinates
const MOCK_BLOOD_BANKS: BloodBank[] = (() => {
  const generated: BloodBank[] = [
    {
      id: "1",
      name: "Amma Blood Centre",
      district: "Visakhapatnam",
      category: "Charitable/Vol",
      inventory: { 
        "A-Ve_Packed Red Blood Cells": 1,
        "O+ve_Packed Red Blood Cells": 12,
        "AB+ve_Packed Red Blood Cells": 4,
        "B+ve_Fresh Frozen Plasma": 48,
        "O+ve_Fresh Frozen Plasma": 68,
        "A+ve_Fresh Frozen Plasma": 22
      },
      lastUpdated: "2026-07-24 10:30:00",
      address: "d.No 11-4-11/1, Kailash Nagar, Kanithi Road, Gajuwaka, Visakhapatnam",
      type: "Blood Bank",
      phone: "9849993672",
      email: "ammabloodcentre@gmail.com",
      lat: 17.6903,
      lng: 83.2093
    },
    {
      id: "2",
      name: "King George Hospital (KGH) Blood Centre",
      district: "Visakhapatnam",
      category: "Govt.",
      inventory: { 
        "A+ve_Packed Red Blood Cells": 25, 
        "O+ve_Packed Red Blood Cells": 40, 
        "B+ve_Whole Blood": 18,
        "O-ve_Packed Red Blood Cells": 5
      },
      lastUpdated: "2026-07-24 11:15:00",
      address: "KGH Hospital Campus, Maharani Peta, Visakhapatnam",
      type: "Blood Bank",
      phone: "08912564891",
      email: "kghbloodbank@ap.gov.in",
      lat: 17.7083,
      lng: 83.3056
    },
    {
      id: "3",
      name: "Apollo Hospital Chinagadhili Blood Centre",
      district: "Visakhapatnam",
      category: "Private",
      inventory: { 
        "O+ve_Single Donor Platelet": 5, 
        "A-Ve_Whole Blood": 2, 
        "AB+ve_Packed Red Blood Cells": 9, 
        "B+ve_Plasma": 40
      },
      lastUpdated: "2026-07-24 09:45:00",
      address: "Health City, Arilova, Chinagadhili, Visakhapatnam",
      type: "Blood Bank",
      phone: "9849949202",
      email: "apollo.vsp.bb@apollo.com",
      lat: 17.7635,
      lng: 83.3198
    },
    {
      id: "4",
      name: "AS Raja Voluntary Blood Centre",
      district: "Visakhapatnam",
      category: "Charitable/Vol",
      inventory: { 
        "O-ve_Packed Red Blood Cells": 3, 
        "B-ve_Packed Red Blood Cells": 1, 
        "O+ve_Platelet Concentrate": 15
      },
      lastUpdated: "2026-07-24 10:00:00",
      address: "Virasi Centre, Waltair Main Road, Visakhapatnam",
      type: "Blood Bank",
      phone: "9849792925",
      email: "asrajavbloodbank@gmail.com",
      lat: 17.7200,
      lng: 83.3150
    },
    {
      id: "5",
      name: "GGH Vijayawada Blood Centre",
      district: "Krishna",
      category: "Govt.",
      inventory: { 
        "A+ve_Packed Red Blood Cells": 30, 
        "B+ve_Packed Red Blood Cells": 22, 
        "O+ve_Packed Red Blood Cells": 45, 
        "AB+ve_Packed Red Blood Cells": 8
      },
      lastUpdated: "2026-07-24 11:30:00",
      address: "Hanumanpet, Near Railway Station, Vijayawada, Krishna",
      type: "Blood Bank",
      phone: "08662574677",
      email: "gghvijayawada@ap.gov.in",
      lat: 16.5100,
      lng: 80.6200
    },
    {
      id: "6",
      name: "Red Cross Society Blood Bank Vijayawada",
      district: "Krishna",
      category: "Charitable/Vol",
      inventory: { 
        "O+ve_Packed Red Blood Cells": 20, 
        "A+ve_Packed Red Blood Cells": 15, 
        "B+ve_Fresh Frozen Plasma": 35
      },
      lastUpdated: "2026-07-24 10:10:00",
      address: "Governorpet, Vijayawada, Krishna",
      type: "Blood Bank",
      phone: "08662571234",
      email: "redcrossvja@yahoo.co.in",
      lat: 16.5120,
      lng: 80.6230
    },
    {
      id: "7",
      name: "GGH Guntur Blood Centre",
      district: "Guntur",
      category: "Govt.",
      inventory: { 
        "O+ve_Packed Red Blood Cells": 38, 
        "B+ve_Packed Red Blood Cells": 29, 
        "A+ve_Packed Red Blood Cells": 18
      },
      lastUpdated: "2026-07-24 10:45:00",
      address: "GGH Campus, Kothapet, Guntur",
      type: "Blood Bank",
      phone: "08632224101",
      email: "gghguntur.bb@ap.gov.in",
      lat: 16.3000,
      lng: 80.4400
    },
    {
      id: "8",
      name: "AIIMS Mangalagiri Transfusion Medicine",
      district: "Guntur",
      category: "Govt.",
      inventory: { 
        "O+ve_Packed Red Blood Cells": 50, 
        "AB+ve_Packed Red Blood Cells": 14, 
        "O-ve_Packed Red Blood Cells": 6
      },
      lastUpdated: "2026-07-24 11:00:00",
      address: "AIIMS Campus, Mangalagiri, Guntur",
      type: "Blood Bank",
      phone: "08632373000",
      email: "transfusion@aiimsmangalagiri.edu.in",
      lat: 16.4350,
      lng: 80.5600
    },
    {
      id: "9",
      name: "SVIMS Blood Bank Tirupati",
      district: "Chittoor",
      category: "Govt.",
      inventory: { 
        "A+ve_Packed Red Blood Cells": 28, 
        "B+ve_Packed Red Blood Cells": 32, 
        "O+ve_Packed Red Blood Cells": 60
      },
      lastUpdated: "2026-07-24 09:30:00",
      address: "Alipiri Road, Tirupati, Chittoor",
      type: "Blood Bank",
      phone: "08772287777",
      email: "svims.transfusion@nic.in",
      lat: 13.6300,
      lng: 79.4000
    },
    {
      id: "10",
      name: "GGH Kurnool Blood Centre",
      district: "Kurnool",
      category: "Govt.",
      inventory: { 
        "O+ve_Packed Red Blood Cells": 42, 
        "B+ve_Packed Red Blood Cells": 24, 
        "A+ve_Fresh Frozen Plasma": 15
      },
      lastUpdated: "2026-07-24 10:20:00",
      address: "Budhawarpet, Kurnool",
      type: "Blood Bank",
      phone: "08518255312",
      email: "gghkurnool.bb@ap.gov.in",
      lat: 15.8280,
      lng: 78.0370
    }
  ];

  const AP_DATA: Record<string, { cities: string[], hospitals: string[] }> = {
    "Visakhapatnam": {
      cities: ["Maharanipeta", "Gajuwaka", "MVP Colony", "Pendurthi", "Anakapalle", "Bheemunipatnam", "Seethammadhara"],
      hospitals: ["King George Hospital (KGH)", "Apollo Blood Center", "Lions Club Blood Bank", "AS Raja Voluntary Blood Centre", "Homi Bhabha Cancer Hospital", "Sanjivani Blood Center", "Seven Hills Hospital Blood Bank", "Bsu Chc Pendurthi", "Bsu Ah Aganampudi"]
    },
    "Srikakulam": {
      cities: ["Srikakulam", "Palakonda", "Tekkali", "Amadalavalasa"],
      hospitals: ["RIMS General Hospital", "Red Cross Society Blood Bank", "GMR Varalakshmi CARE", "Srikakulam District Hospital"]
    },
    "Vizianagaram": {
      cities: ["Vizianagaram", "Bobbili", "Parvathipuram"],
      hospitals: ["Maharaja District Hospital", "MIMS Blood Bank", "Govt Area Hospital Bobbili"]
    },
    "East Godavari": {
      cities: ["Rajahmundry", "Kakinada", "Amalapuram", "Tuni"],
      hospitals: ["GGH Kakinada", "Hope International Hospital", "GSL Medical College Blood Bank", "KIMS Rajahmundry", "Rotary Blood Bank Kakinada"]
    },
    "West Godavari": {
      cities: ["Eluru", "Bhimavaram", "Tadepalligudem", "Tanuku"],
      hospitals: ["District Hospital Eluru", "Alluri Sitarama Raju Academy", "Red Cross Bhimavaram"]
    },
    "Krishna": {
      cities: ["Vijayawada", "Governorpet", "Machilipatnam", "Gudivada"],
      hospitals: ["Siddhartha Medical College", "NTR University Blood Bank", "Latha Super Specialty Blood Bank", "New Govt General Hospital"]
    },
    "Guntur": {
      cities: ["Guntur", "Tenali", "Narasaraopet", "Mangalagiri"],
      hospitals: ["NRI General Hospital", "Katuri Medical College", "GGH Guntur", "Manipal Hospital", "Red Cross Society Guntur"]
    },
    "Prakasam": {
      cities: ["Ongole", "Chirala", "Kandukur", "Markapur"],
      hospitals: ["RIMS Ongole", "KIMS Hospital Blood Bank", "Chirala Area Hospital"]
    },
    "Nellore": {
      cities: ["Nellore", "Kavali", "Gudur"],
      hospitals: ["Narayana Medical College", "Apollo Speciality Hospitals", "DSR Govt Hospital", "Red Cross Nellore"]
    },
    "Chittoor": {
      cities: ["Tirupati", "Chittoor", "Madanapalle", "Srikalahasti"],
      hospitals: ["SVIMS Hospital Blood Bank", "SVRR Govt General Hospital", "Apollo Blood Bank"]
    },
    "Kadapa": {
      cities: ["Kadapa", "Proddatur", "Rajampet"],
      hospitals: ["RIMS Kadapa", "Fathima Institute", "Proddatur District Hospital"]
    },
    "Anantapur": {
      cities: ["Anantapur", "Hindupur", "Guntakal"],
      hospitals: ["Govt Medical College Hospital", "KIMS Saveera", "Red Cross Anantapur"]
    },
    "Kurnool": {
      cities: ["Kurnool", "Nandyal", "Adoni"],
      hospitals: ["Kurnool Medical College", "Viswa Bharathi Medical College", "Medicover Hospital"]
    }
  };

  let idCounter = 11;
  for (const district of DISTRICTS) {
    const data = AP_DATA[district];
    if (!data) continue;
    
    const baseCoords = AP_CITY_COORDINATES[district] || { lat: 16.5, lng: 80.6 };

    for (let i = 0; i < 10; i++) {
      let category = i % 3 === 0 ? "Govt." : i % 5 === 0 ? "Charitable/Vol" : "Private";
      const city = data.cities[i % data.cities.length];
      const cityCoords = AP_CITY_COORDINATES[city] || baseCoords;

      const latOffset = (Math.random() - 0.5) * 0.04;
      const lngOffset = (Math.random() - 0.5) * 0.04;

      const name = i < data.hospitals.length ? data.hospitals[i] : `${city} Blood Centre ${i + 1}`;
      const address = `D.No ${i * 12 + 4}-10, Main Road, ${city}, ${district}, Andhra Pradesh`;

      const inventory: Record<string, number> = {
        "A+ve_Packed Red Blood Cells": Math.floor(Math.random() * 35) + 1,
        "O+ve_Packed Red Blood Cells": Math.floor(Math.random() * 50) + 1,
        "B+ve_Packed Red Blood Cells": Math.floor(Math.random() * 30) + 1,
        "AB+ve_Packed Red Blood Cells": Math.floor(Math.random() * 15) + 1,
        "O+ve_Fresh Frozen Plasma": Math.floor(Math.random() * 40) + 1
      };

      generated.push({
        id: String(idCounter++),
        name: name,
        district: district,
        category: category,
        inventory: inventory,
        lastUpdated: `2026-07-24 ${String(Math.floor(Math.random() * 10) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 50) + 10).padStart(2, '0')}:00`,
        address: address,
        type: "Blood Bank",
        phone: `0${Math.floor(Math.random() * 800) + 800}${Math.floor(Math.random() * 800000) + 100000}`,
        email: `info.${city.toLowerCase()}bb@gmail.com`,
        lat: cityCoords.lat + latOffset,
        lng: cityCoords.lng + lngOffset
      });
    }
  }

  return generated;
})();

export default function BloodAvailabilityPage() {
  const [selectedService, setSelectedService] = useState("Blood Availability");
  const [selectedState, setSelectedState] = useState("Andhra Pradesh");
  const [selectedDistrict, setSelectedDistrict] = useState("Select");
  const [searchCenter, setSearchCenter] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("All");
  const [selectedComponent, setSelectedComponent] = useState("Packed Red Blood Cells");
  const [campStartDate, setCampStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [campEndDate, setCampEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Geolocation & Nearby State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatusMessage, setLocationStatusMessage] = useState<string | null>(null);
  const [nearbyRangeKm, setNearbyRangeKm] = useState<number>(5); // 5 km default
  const [isNearbyActive, setIsNearbyActive] = useState(false);

  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<BloodBank[]>([]);
  const [campResults, setCampResults] = useState<Camp[]>(MOCK_CAMPS);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Modals
  const [shareModalData, setShareModalData] = useState<BloodBank | null>(null);
  const [stockModalData, setStockModalData] = useState<BloodBank | null>(null);

  // --- TRIGGER GEOLOCATION NEARBY SEARCH ---
  const handleDetectLocationAndSearch = (range: number = nearbyRangeKm, overrideCoords?: { lat: number; lng: number }) => {
    setNearbyRangeKm(range);

    if (overrideCoords) {
      setUserLocation(overrideCoords);
      executeNearbyFilter(overrideCoords.lat, overrideCoords.lng, range);
      return;
    }

    if (!navigator.geolocation) {
      setLocationStatusMessage("Geolocation is not supported by your browser. Please select a city preset below.");
      return;
    }

    setIsLocating(true);
    setLocationStatusMessage("📡 Requesting GPS permission from your device...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(coords);
        setIsLocating(false);
        setLocationStatusMessage(`✅ GPS Location Verified: (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
        executeNearbyFilter(coords.lat, coords.lng, range);
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = "Unable to fetch GPS position.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission denied. Please allow location access or choose a sample AP city below to test nearby 5 km search.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = "Location position unavailable. Please try again or select a city preset.";
        } else if (error.code === error.TIMEOUT) {
          errorMsg = "GPS location request timed out. Retrying or choose a city preset.";
        }
        setLocationStatusMessage(errorMsg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const executeNearbyFilter = (lat: number, lng: number, rangeKm: number) => {
    setIsNearbyActive(true);
    setHasSearched(true);
    setCurrentPage(1);

    const calculatedResults = MOCK_BLOOD_BANKS.map((bank) => {
      const distance = getHaversineDistance(lat, lng, bank.lat, bank.lng);
      
      let availableDisplay = "Not Available";
      if (selectedBloodGroup === "All") {
        const availableItems: string[] = [];
        for (const [key, qty] of Object.entries(bank.inventory)) {
          if (key.includes(selectedComponent) && qty > 0) {
            const group = key.split('_')[0];
            availableItems.push(`${group}: ${qty}`);
          }
        }
        if (availableItems.length > 0) {
          availableDisplay = availableItems.join(", ");
        }
      } else {
        const qty = bank.inventory[`${selectedBloodGroup}_${selectedComponent}`] || 0;
        if (qty > 0) {
          availableDisplay = `${selectedBloodGroup}: ${qty}`;
        }
      }

      return {
        ...bank,
        distanceKm: distance,
        availableDisplay
      };
    })
    .filter(bank => bank.distanceKm <= rangeKm)
    .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

    setSearchResults(calculatedResults);
  };

  // Regular Search Handler
  const handleSearch = () => {
    setIsNearbyActive(false);
    setHasSearched(true);
    setCurrentPage(1);

    if (selectedService === "Camp Schedule") {
      const filteredCamps = MOCK_CAMPS.filter(camp => {
        if (selectedDistrict !== "Select" && camp.district !== selectedDistrict) return false;
        if (searchCenter && !camp.name.toLowerCase().includes(searchCenter.toLowerCase())) return false;
        return true;
      });
      setCampResults(filteredCamps);
      return;
    }

    const results = MOCK_BLOOD_BANKS.filter(bank => {
      if (selectedDistrict !== "Select" && bank.district !== selectedDistrict) return false;
      if (searchCenter && !bank.name.toLowerCase().includes(searchCenter.toLowerCase())) return false;
      return true;
    }).map(bank => {
      let availableDisplay = "Not Available";
      if (selectedBloodGroup === "All") {
        const availableItems: string[] = [];
        for (const [key, qty] of Object.entries(bank.inventory)) {
          if (key.includes(selectedComponent) && qty > 0) {
            const group = key.split('_')[0];
            availableItems.push(`${group}: ${qty}`);
          }
        }
        if (availableItems.length > 0) {
          availableDisplay = availableItems.join(", ");
        }
      } else {
        const qty = bank.inventory[`${selectedBloodGroup}_${selectedComponent}`] || 0;
        if (qty > 0) {
          availableDisplay = `${selectedBloodGroup}: ${qty}`;
        }
      }

      return {
        ...bank,
        availableDisplay
      };
    });

    setSearchResults(results);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage) || 1;

  const currentCampItems = campResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalCampPages = Math.ceil(campResults.length / itemsPerPage) || 1;

  let mainContent = null;
  if (selectedService === "Blood Availability" || selectedService === "Blood Center Directory") {
    mainContent = (
      <div>
        {/* Selected Fields & Nearby Status Bar */}
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">Search Context:</span>
            {isNearbyActive ? (
              <span className="bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 fill-emerald-600 animate-pulse" />
                GPS Nearby Search Active ({nearbyRangeKm} km radius)
              </span>
            ) : (
              <span className="bg-[#e6f0f9] dark:bg-blue-900/30 text-[#1e4d8c] dark:text-blue-300 text-xs px-3 py-1 rounded-full">
                {`${selectedState} / ${selectedDistrict === "Select" ? "All Districts" : selectedDistrict} / ${selectedBloodGroup === "All" ? "All Groups" : selectedBloodGroup} / ${selectedComponent}`}
              </span>
            )}
          </div>

          <div className="relative w-full md:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Quick filter results..." 
              className="pl-9 pr-4 py-1.5 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded text-sm w-full md:w-56" 
              onChange={(e) => setSearchCenter(e.target.value)}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="container mx-auto px-4 pb-12">
          <div className="bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm min-h-[400px] flex flex-col">
            <div className="grid grid-cols-[45px_2.2fr_1fr_1fr_1.3fr_1.3fr_60px] bg-[#efe9e9] dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 p-3 text-xs font-bold text-neutral-800 dark:text-neutral-200 px-4">
              <div>S.No.</div>
              <div>Blood Center</div>
              <div>Category</div>
              <div>{isNearbyActive ? 'Distance' : 'Type'}</div>
              <div>Availability</div>
              <div>Last Updated</div>
              <div className="text-right">Action</div>
            </div>

            <div className="flex-1 flex flex-col">
              {!hasSearched ? (
                <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 py-16 px-4 text-center">
                  <Compass className="w-14 h-14 mb-3 text-brand opacity-40 animate-spin-slow" />
                  <p className="text-base font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Ready to Search Real Blood Availability
                  </p>
                  <p className="text-xs text-neutral-500 max-w-md">
                    Click <strong>"📍 Allow Location & Find Nearby (5 km)"</strong> above or select a district to view live blood stock.
                  </p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 py-16 px-4 text-center">
                  <AlertCircle className="w-12 h-12 mb-3 text-amber-500 opacity-80" />
                  <p className="text-base font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    No Blood Centers Found within {nearbyRangeKm} km
                  </p>
                  <p className="text-xs text-neutral-500 max-w-md mb-4">
                    There are no registered blood centers within {nearbyRangeKm} km of your detected location. Would you like to expand your search range?
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button 
                      size="sm" 
                      onClick={() => userLocation ? executeNearbyFilter(userLocation.lat, userLocation.lng, 10) : handleDetectLocationAndSearch(10)} 
                      className="bg-brand text-white text-xs h-8"
                    >
                      Expand to 10 km
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => userLocation ? executeNearbyFilter(userLocation.lat, userLocation.lng, 25) : handleDetectLocationAndSearch(25)} 
                      className="bg-neutral-800 text-white text-xs h-8"
                    >
                      Expand to 25 km
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => { setSelectedDistrict("Visakhapatnam"); handleSearch(); }} 
                      className="text-xs h-8"
                    >
                      View All Visakhapatnam Centers
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800 flex flex-col px-4">
                  {currentItems.map((bank, index) => (
                    <div key={bank.id} className="flex flex-col pt-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <div className="grid grid-cols-[45px_2.2fr_1fr_1fr_1.3fr_1.3fr_60px] text-xs items-center gap-2 pb-3">
                        <div className="text-blue-600 dark:text-blue-400 pl-1 font-semibold">{indexOfFirstItem + index + 1}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-neutral-900 dark:text-neutral-100 mb-0.5 text-[13px]">{bank.name}</p>
                            {bank.distanceKm !== undefined && (
                              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
                                📍 {bank.distanceKm} km
                              </span>
                            )}
                          </div>
                          <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-snug pr-4">{bank.address}</p>
                        </div>
                        <div>
                          <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${
                            bank.category === 'Govt.' 
                              ? 'border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300' 
                              : bank.category === 'Charitable/Vol' 
                              ? 'border-orange-300 text-orange-700 bg-orange-50 dark:bg-orange-950/40 dark:border-orange-800 dark:text-orange-300' 
                              : 'border-neutral-300 text-neutral-700 bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'
                          }`}>
                            {bank.category}
                          </span>
                        </div>
                        <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {bank.distanceKm !== undefined ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">📍 {bank.distanceKm} km away</span>
                          ) : (
                            bank.type
                          )}
                        </div>
                        <div>
                          <span className={`font-semibold ${bank.availableDisplay === 'Not Available' ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {bank.availableDisplay}
                          </span>
                        </div>
                        <div className="text-neutral-700 dark:text-neutral-300">{bank.lastUpdated}</div>
                        <div className="text-right">
                          <button 
                            onClick={(e) => { e.preventDefault(); setShareModalData(bank); }} 
                            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-xs"
                          >
                            Share
                          </button>
                        </div>
                      </div>
                      
                      <div 
                        onClick={() => setStockModalData(bank)}
                        className="bg-[#e8eedd] dark:bg-emerald-950/40 text-[#2c531d] dark:text-emerald-300 text-xs font-bold text-center py-1.5 border-x-[8px] border-white dark:border-neutral-900 mb-2 cursor-pointer hover:bg-[#d8e0cc] transition-colors rounded flex items-center justify-center gap-1.5"
                      >
                        📊 View Full Component Stock Breakdown
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {hasSearched && searchResults.length > 0 && (
              <div className="border-t border-neutral-200 dark:border-neutral-800 p-3 bg-white dark:bg-neutral-900 flex items-center justify-between gap-2">
                <span className="text-xs text-neutral-500">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, searchResults.length)} of {searchResults.length} blood centers
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1} 
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold px-2">{currentPage} / {totalPages}</span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages} 
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else if (selectedService === "Camp Schedule") {
    mainContent = (
      <div>
        {/* Camp Schedule Notification Subscribe Bar */}
        <div className="container mx-auto px-4 py-3">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex flex-wrap items-center gap-3 shadow-sm">
            <div className="flex items-center gap-3 flex-1 min-w-[240px]">
              <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-white animate-bounce" />
              </div>
              <div>
                <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">Get Notified About Nearby Donation Camps!</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Subscribe for real-time alerts when a camp is scheduled in your district.</p>
              </div>
            </div>
            <select className="border border-neutral-300 dark:border-neutral-700 rounded p-2 text-xs bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 w-36">
              <option>Andhra Pradesh</option>
            </select>
            <select className="border border-neutral-300 dark:border-neutral-700 rounded p-2 text-xs bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 w-36">
              <option>Select District</option>
              {DISTRICTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <input type="email" placeholder="Enter Email Address" className="border border-neutral-300 dark:border-neutral-700 rounded p-2 text-xs bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 w-40" />
            <input type="text" placeholder="Mobile Number" className="border border-neutral-300 dark:border-neutral-700 rounded p-2 text-xs bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 w-36" />
            <button className="bg-brand text-white px-4 py-2 rounded text-xs font-bold hover:bg-[#6b0000] transition-colors">
              Subscribe Alerts
            </button>
          </div>
        </div>

        {/* Camp Table */}
        <div className="container mx-auto px-4 pb-12 pt-2">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm flex flex-col">
            <div className="grid grid-cols-[45px_90px_2.2fr_1.2fr_1.1fr_1.4fr_1.1fr_100px_130px] bg-[#efe9e9] dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 p-3 text-xs font-bold text-neutral-800 dark:text-neutral-200 px-4">
              <div>S.No.</div>
              <div>Date</div>
              <div>Camp Detail</div>
              <div>State/District</div>
              <div>Contact</div>
              <div>Conducted By</div>
              <div>Organised By</div>
              <div>Time</div>
              <div className="text-right">Action</div>
            </div>

            {campResults.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 py-16 px-4 text-center">
                <Calendar className="w-12 h-12 mb-3 text-amber-500 opacity-80" />
                <p className="text-base font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  No Blood Donation Camps Scheduled
                </p>
                <p className="text-xs text-neutral-500 max-w-md mb-4">
                  {selectedDistrict !== "Select" 
                    ? `No upcoming voluntary blood donation camps are currently registered in ${selectedDistrict} district.`
                    : "No upcoming blood donation camps matched your search criteria."}
                </p>
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-3 rounded-lg text-amber-800 dark:text-amber-300 text-xs max-w-md">
                  💡 <strong>Notification Alert:</strong> Use the subscription panel above to receive SMS alerts as soon as a new camp is scheduled in {selectedDistrict !== "Select" ? selectedDistrict : "your area"}.
                </div>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800 flex flex-col px-4">
                {currentCampItems.map((camp, idx) => (
                  <div key={camp.id} className="grid grid-cols-[45px_90px_2.2fr_1.2fr_1.1fr_1.4fr_1.1fr_100px_130px] text-xs items-center gap-2 py-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <div className="text-blue-600 dark:text-blue-400 font-semibold">{indexOfFirstItem + idx + 1}</div>
                    <div>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-[11px]">
                        {camp.date}
                      </span>
                    </div>
                    <div>
                      <p className="font-extrabold text-neutral-900 dark:text-neutral-100 text-[12px] uppercase">{camp.name}</p>
                      <p className="text-[11px] text-neutral-500 flex items-start gap-1 mt-0.5 leading-snug">
                        <MapPin className="w-3 h-3 text-neutral-400 shrink-0 mt-0.5" /> {camp.venue}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200">Andhra Pradesh,</p>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400">{camp.district}</p>
                    </div>
                    <div className="font-medium text-neutral-800 dark:text-neutral-200">
                      <a href={`tel:${camp.contact}`} className="hover:underline">{camp.contact}</a>
                    </div>
                    <div className="text-neutral-700 dark:text-neutral-300 text-[11px]">{camp.conductedBy}</div>
                    <div className="text-neutral-700 dark:text-neutral-300 text-[11px]">{camp.organisedBy}</div>
                    <div className="text-neutral-600 dark:text-neutral-400 text-[11px] font-medium">{camp.time}</div>
                    <div className="text-right">
                      <button 
                        onClick={() => alert(`Registration initiated for ${camp.name}. Contact: ${camp.contact}`)}
                        className="text-brand dark:text-red-400 font-bold hover:underline text-[11px] border-b border-brand dark:border-red-400 inline-block"
                      >
                        Register as Voluntary Donor
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Camp Pagination */}
            {campResults.length > 0 && (
              <div className="border-t border-neutral-200 dark:border-neutral-800 p-3 bg-white dark:bg-neutral-900 flex items-center justify-between gap-2">
                <span className="text-xs text-neutral-500">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, campResults.length)} of {campResults.length} donation camps
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1} 
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold px-2">{currentPage} / {totalCampPages}</span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalCampPages, p + 1))} 
                    disabled={currentPage === totalCampPages} 
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 bg-neutral-50 dark:bg-background">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-red-950 via-[#8b0000] to-red-900 text-white py-8 mb-4 shadow-md">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="bg-red-500/20 text-red-200 border border-red-500/30 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider mb-2 inline-block">
                  GPS Geolocation Enabled — Real-Time Stock Search
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Find Nearby Blood Availability & Centers
                </h1>
                <p className="text-xs md:text-sm text-red-100 mt-1 max-w-2xl">
                  Allow your device location to search real blood availability within 5 km, 10 km, or 25 km of your position.
                </p>
              </div>

              {/* Geolocation Button */}
              <div className="bg-white/10 p-3 rounded-xl border border-white/20 shadow-inner flex flex-col items-center gap-2 shrink-0">
                <Button 
                  onClick={() => handleDetectLocationAndSearch(5)}
                  disabled={isLocating}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 h-11 shadow-lg flex items-center gap-2 text-xs"
                >
                  {isLocating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Detecting Location...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4" /> 📍 Allow Location & Search (Within 5 km)
                    </>
                  )}
                </Button>
                <div className="flex items-center gap-1.5 text-[11px] text-red-100">
                  <span>Range:</span>
                  <button onClick={() => handleDetectLocationAndSearch(5)} className={`px-2 py-0.5 rounded font-bold ${nearbyRangeKm === 5 ? 'bg-white text-brand' : 'hover:bg-white/20'}`}>5 km</button>
                  <button onClick={() => handleDetectLocationAndSearch(10)} className={`px-2 py-0.5 rounded font-bold ${nearbyRangeKm === 10 ? 'bg-white text-brand' : 'hover:bg-white/20'}`}>10 km</button>
                  <button onClick={() => handleDetectLocationAndSearch(25)} className={`px-2 py-0.5 rounded font-bold ${nearbyRangeKm === 25 ? 'bg-white text-brand' : 'hover:bg-white/20'}`}>25 km</button>
                </div>
              </div>
            </div>

            {/* Location Status Notice */}
            {locationStatusMessage && (
              <div className="mt-4 p-3 bg-black/30 border border-white/20 rounded-lg text-xs flex items-center justify-between">
                <span className="font-medium">{locationStatusMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800 mb-4">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Service Type</label>
                <select 
                  className="w-full border border-neutral-300 dark:border-neutral-700 rounded p-2 text-sm bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-bold text-brand"
                  value={selectedService}
                  onChange={(e) => {
                    setSelectedService(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="Blood Availability">Blood Availability</option>
                  <option value="Camp Schedule">Camp Schedule</option>
                  <option value="Blood Center Directory">Blood Center Directory</option>
                </select>
              </div>

              {selectedService === "Camp Schedule" ? (
                <div className="col-span-1 md:col-span-5 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">State</label>
                    <select className="w-full border border-neutral-300 dark:border-neutral-700 rounded p-2 text-sm bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">District</label>
                    <select className="w-full border border-neutral-300 dark:border-neutral-700 rounded p-2 text-sm bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
                      <option value="Select">All Districts</option>
                      {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Start Date</label>
                    <input type="date" className="w-full border border-neutral-300 dark:border-neutral-700 rounded p-2 text-sm bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100" value={campStartDate} onChange={(e) => setCampStartDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">To Date</label>
                    <input type="date" className="w-full border border-neutral-300 dark:border-neutral-700 rounded p-2 text-sm bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100" value={campEndDate} onChange={(e) => setCampEndDate(e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSearch} className="w-full bg-[#8b0000] hover:bg-[#6b0000] text-white text-xs h-9 font-bold">
                      🔍 Search Camps
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="col-span-1 md:col-span-5 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">State</label>
                    <select className="w-full border border-neutral-300 dark:border-neutral-700 rounded p-2 text-sm bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">District</label>
                    <select className="w-full border border-neutral-300 dark:border-neutral-700 rounded p-2 text-sm bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
                      <option value="Select">All Districts</option>
                      {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Blood Group</label>
                    <select className="w-full border border-neutral-300 dark:border-neutral-700 rounded p-2 text-sm bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-bold text-brand" value={selectedBloodGroup} onChange={(e) => setSelectedBloodGroup(e.target.value)}>
                      {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Component</label>
                    <select className="w-full border border-neutral-300 dark:border-neutral-700 rounded p-2 text-sm bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 text-xs" value={selectedComponent} onChange={(e) => setSelectedComponent(e.target.value)}>
                      {COMPONENTS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSearch} className="w-full bg-[#8b0000] hover:bg-[#6b0000] text-white text-xs h-9 font-bold">
                      🔍 Filter
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {mainContent}

        {/* Share Modal */}
        {shareModalData && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShareModalData(null)}>
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-[480px] p-6 border border-neutral-200 dark:border-neutral-800" onClick={e => e.stopPropagation()}>
              <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100">{shareModalData.name}</h3>
              <p className="text-xs text-neutral-500 mt-1 mb-4">{shareModalData.address}</p>
              <div className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs space-y-2 mb-4">
                <p><strong>Phone:</strong> {shareModalData.phone}</p>
                <p><strong>Email:</strong> {shareModalData.email}</p>
                {shareModalData.distanceKm !== undefined && (
                  <p className="text-emerald-600 font-bold">📍 Distance: {shareModalData.distanceKm} km away</p>
                )}
              </div>
              <Button onClick={() => setShareModalData(null)} className="w-full text-xs h-9">Close</Button>
            </div>
          </div>
        )}

        {/* Stock Modal */}
        {stockModalData && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setStockModalData(null)}>
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-4xl p-6 border border-neutral-200 dark:border-neutral-800 space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                  <h3 className="text-lg font-extrabold text-neutral-900 dark:text-neutral-100">{stockModalData.name}</h3>
                  <p className="text-xs text-neutral-500">{stockModalData.address}</p>
                </div>
                <button onClick={() => setStockModalData(null)} className="text-neutral-400 hover:text-neutral-600 font-bold text-xl">×</button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(stockModalData.inventory).map(([key, qty]) => {
                  const [group, comp] = key.split('_');
                  return (
                    <div key={key} className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-brand text-sm block">{group}</span>
                        <span className="text-[10px] text-neutral-500 line-clamp-1">{comp}</span>
                      </div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                        {qty} Units
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <Button onClick={() => setStockModalData(null)} className="w-full text-xs h-9 font-bold">
                  Close Inventory Details
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
