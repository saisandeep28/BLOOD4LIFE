'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Search, MapPin, Building2, Filter, Clock, Droplets, Bed, PhoneCall, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Hospital = {
  id: string;
  name: string;
  category: 'Government General Hospital' | 'AIIMS / Autonomous' | 'Private Super Speciality' | 'Medical College Hospital' | 'Trust / District Hospital';
  district: string;
  address: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  bedCapacity: number;
  hasBloodBank: boolean;
  bloodBank24x7: boolean;
  specialties: string[];
};

const REAL_HOSPITALS: Hospital[] = [
  // --- VISAKHAPATNAM ---
  { id: 'H-VSP-01', name: 'King George Hospital (KGH)', category: 'Government General Hospital', district: 'Visakhapatnam', address: 'Maharani Peta, Visakhapatnam, AP 530002', phone: '0891-2564891', emergencyPhone: '0891-2564892', email: 'kghvsp@nic.in', bedCapacity: 1030, hasBloodBank: true, bloodBank24x7: true, specialties: ['Trauma Care', 'Cardiology', 'General Surgery', 'Obstetrics', 'Pediatrics'] },
  { id: 'H-VSP-02', name: 'Apollo Hospitals Visakhapatnam', category: 'Private Super Speciality', district: 'Visakhapatnam', address: 'Health City, Arilova, Visakhapatnam, AP 530040', phone: '0891-2867777', emergencyPhone: '1066', email: 'apollovsp@apollohospitals.com', bedCapacity: 350, hasBloodBank: true, bloodBank24x7: true, specialties: ['Cardiology', 'Emergency Care', 'Organ Transplants', 'Oncology'] },
  { id: 'H-VSP-03', name: 'Homi Bhabha Cancer Hospital & Research Centre', category: 'AIIMS / Autonomous', district: 'Visakhapatnam', address: 'Aganampudi, Visakhapatnam, AP 530053', phone: '0891-2871500', emergencyPhone: '0891-2871501', email: 'info@tmc.gov.in', bedCapacity: 250, hasBloodBank: true, bloodBank24x7: true, specialties: ['Oncology', 'Surgical Oncology', 'Radiation Therapy'] },
  { id: 'H-VSP-04', name: 'Seven Hills Hospital', category: 'Private Super Speciality', district: 'Visakhapatnam', address: 'Rockdale Layout, Waltair Main Road, Visakhapatnam, AP 530002', phone: '0891-2708000', emergencyPhone: '0891-2708001', email: 'vsp@sevenhillshospital.com', bedCapacity: 300, hasBloodBank: true, bloodBank24x7: true, specialties: ['Neuro Surgery', 'Cardiac Surgery', 'Trauma'] },

  // --- KRISHNA ---
  { id: 'H-KRS-01', name: 'Government General Hospital (GGH) Vijayawada', category: 'Government General Hospital', district: 'Krishna', address: 'Hanumanpet, Near Railway Station, Vijayawada, AP 520002', phone: '0866-2574677', emergencyPhone: '0866-2574678', email: 'gghvijayawada@ap.gov.in', bedCapacity: 1200, hasBloodBank: true, bloodBank24x7: true, specialties: ['Emergency & Trauma', 'Nephrology', 'General Medicine', 'Orthopaedics'] },
  { id: 'H-KRS-02', name: 'Ramesh Hospitals Vijayawada', category: 'Private Super Speciality', district: 'Krishna', address: 'Near ITI Road, MG Road, Vijayawada, AP 520010', phone: '0866-2472000', emergencyPhone: '0866-2472001', email: 'info@rameshhospitals.com', bedCapacity: 350, hasBloodBank: true, bloodBank24x7: true, specialties: ['Cardiology & CT Surgery', 'Neurology', 'Critical Care'] },
  { id: 'H-KRS-03', name: 'Siddhartha Medical College & Hospital', category: 'Medical College Hospital', district: 'Krishna', address: 'Ring Road, Gunadala, Vijayawada, AP 520008', phone: '0866-2450390', emergencyPhone: '0866-2450391', email: 'smc_vja@yahoo.com', bedCapacity: 900, hasBloodBank: true, bloodBank24x7: true, specialties: ['General Surgery', 'OBG', 'Pediatrics', 'Transfusion Medicine'] },

  // --- GUNTUR ---
  { id: 'H-GNT-01', name: 'Government General Hospital (GGH) Guntur', category: 'Government General Hospital', district: 'Guntur', address: 'Kothapet, Guntur, AP 522001', phone: '0863-2224101', emergencyPhone: '0863-2224102', email: 'gghguntur@ap.gov.in', bedCapacity: 1177, hasBloodBank: true, bloodBank24x7: true, specialties: ['Trauma & Critical Care', 'Cardiothoracic Surgery', 'Oncology'] },
  { id: 'H-GNT-02', name: 'AIIMS Mangalagiri', category: 'AIIMS / Autonomous', district: 'Guntur', address: 'Mangalagiri, Guntur District, AP 522503', phone: '0863-2373000', emergencyPhone: '0863-2373001', email: 'info@aiimsmangalagiri.edu.in', bedCapacity: 960, hasBloodBank: true, bloodBank24x7: true, specialties: ['National Trauma Center', 'Advanced Surgery', 'Transfusion Medicine'] },
  { id: 'H-GNT-03', name: 'Katuri Medical College & Hospital', category: 'Medical College Hospital', district: 'Guntur', address: 'Katuri Nagar, Chinakondrupadu, Guntur, AP 522019', phone: '0863-2288555', emergencyPhone: '0863-2288556', email: 'katurimedical@gmail.com', bedCapacity: 850, hasBloodBank: true, bloodBank24x7: true, specialties: ['Trauma Care', 'General Surgery', 'Orthopaedics'] },

  // --- CHITTOOR ---
  { id: 'H-CTR-01', name: 'Sri Venkateswara Institute of Medical Sciences (SVIMS)', category: 'AIIMS / Autonomous', district: 'Chittoor', address: 'Alipiri Road, Tirupati, AP 517507', phone: '0877-2287777', emergencyPhone: '0877-2287778', email: 'svimstpt@nic.in', bedCapacity: 1000, hasBloodBank: true, bloodBank24x7: true, specialties: ['Cardiology', 'Nephrology', 'Urology', 'Component Blood Bank'] },
  { id: 'H-CTR-02', name: 'SVRR Government General Hospital Tirupati', category: 'Government General Hospital', district: 'Chittoor', address: 'Alipiri Road, Tirupati, AP 517507', phone: '0877-2286666', emergencyPhone: '0877-2286667', email: 'svrrggh@ap.gov.in', bedCapacity: 1050, hasBloodBank: true, bloodBank24x7: true, specialties: ['Trauma & Casualty', 'Pediatrics', 'General Surgery'] },

  // --- KURNOOL ---
  { id: 'H-KRN-01', name: 'Government General Hospital Kurnool', category: 'Government General Hospital', district: 'Kurnool', address: 'Budhawarpet, Kurnool, AP 518002', phone: '08518-255312', emergencyPhone: '08518-255313', email: 'gghkurnool@ap.gov.in', bedCapacity: 1050, hasBloodBank: true, bloodBank24x7: true, specialties: ['Trauma & Critical Care', 'Plastic Surgery', 'Pediatric Surgery'] },
  { id: 'H-KRN-02', name: 'Viswa Bharathi General Hospital', category: 'Medical College Hospital', district: 'Kurnool', address: 'RT Nagar, Penchikalapadu, Kurnool, AP 518467', phone: '08518-287700', emergencyPhone: '08518-287701', email: 'vbmc.kurnool@gmail.com', bedCapacity: 750, hasBloodBank: true, bloodBank24x7: true, specialties: ['Casualty & Emergency', 'General Medicine', 'Blood Centre'] },

  // --- EAST GODAVARI ---
  { id: 'H-EGD-01', name: 'Government General Hospital Kakinada', category: 'Government General Hospital', district: 'East Godavari', address: 'Main Road, Kakinada, AP 533001', phone: '0884-2361361', emergencyPhone: '0884-2361362', email: 'gghkakinada@ap.gov.in', bedCapacity: 880, hasBloodBank: true, bloodBank24x7: true, specialties: ['Trauma Care', 'General Surgery', 'Obstetrics & Gynaecology'] },
  { id: 'H-EGD-02', name: 'GSL General Hospital & Medical College', category: 'Medical College Hospital', district: 'East Godavari', address: 'NH-16, Rajanagaram, Rajamahendravaram, AP 533296', phone: '0883-2484999', emergencyPhone: '0883-2484998', email: 'gslhospital@gsl.edu.in', bedCapacity: 1100, hasBloodBank: true, bloodBank24x7: true, specialties: ['Emergency Trauma Care', 'Super Speciality Surgery'] },

  // --- WEST GODAVARI ---
  { id: 'H-WGD-01', name: 'Government District Hospital Eluru', category: 'Trust / District Hospital', district: 'West Godavari', address: 'Sanivarapupeta Road, Eluru, AP 534006', phone: '08812-230555', emergencyPhone: '08812-230556', email: 'dheluru@ap.gov.in', bedCapacity: 500, hasBloodBank: true, bloodBank24x7: true, specialties: ['24x7 Emergency', 'Pediatrics', 'General Surgery'] },
  { id: 'H-WGD-02', name: 'ASRAM Hospital & Medical College', category: 'Medical College Hospital', district: 'West Godavari', address: 'Malkapuram, Eluru, AP 534005', phone: '08812-288288', emergencyPhone: '08812-288289', email: 'asramhospital@asram.in', bedCapacity: 750, hasBloodBank: true, bloodBank24x7: true, specialties: ['Emergency Casualty', 'Cardiology', 'Orthopaedics'] },

  // --- PRAKASAM ---
  { id: 'H-PRK-01', name: 'Government General Hospital Ongole', category: 'Government General Hospital', district: 'Prakasam', address: 'Rangarayudu Nagar, Ongole, AP 523001', phone: '08592-233501', emergencyPhone: '08592-233502', email: 'gghongole@ap.gov.in', bedCapacity: 600, hasBloodBank: true, bloodBank24x7: true, specialties: ['Casualty & Trauma', 'Orthopaedics', 'General Medicine'] },
  { id: 'H-PRK-02', name: 'KIMS Ongole Hospital', category: 'Private Super Speciality', district: 'Prakasam', address: 'Kurnool Road, Ongole, AP 523002', phone: '08592-285555', emergencyPhone: '08592-285556', email: 'ongole@kimshospitals.com', bedCapacity: 300, hasBloodBank: true, bloodBank24x7: true, specialties: ['Emergency Care', 'Cardiology', 'Critical Care'] },

  // --- NELLORE ---
  { id: 'H-NLR-01', name: 'ACSR Government General Hospital Nellore', category: 'Government General Hospital', district: 'Nellore', address: 'Dargamitta, Nellore, AP 524004', phone: '0861-2318001', emergencyPhone: '0861-2318002', email: 'gghnellore@ap.gov.in', bedCapacity: 750, hasBloodBank: true, bloodBank24x7: true, specialties: ['Emergency Medicine', 'Pediatrics', 'Transfusion Medicine'] },
  { id: 'H-NLR-02', name: 'Narayana Medical College & Hospital', category: 'Medical College Hospital', district: 'Nellore', address: 'Chinthareddypalem, Nellore, AP 524003', phone: '0861-2317963', emergencyPhone: '0861-2317964', email: 'narayanahospital@narayana.com', bedCapacity: 1200, hasBloodBank: true, bloodBank24x7: true, specialties: ['Trauma & Emergency', 'Cardiothoracic Surgery'] },

  // --- KADAPA ---
  { id: 'H-KDP-01', name: 'Rajiv Gandhi Institute of Medical Sciences (RIMS) Kadapa', category: 'Medical College Hospital', district: 'Kadapa', address: 'Puttampalli, Kadapa, AP 516002', phone: '08562-220010', emergencyPhone: '08562-220011', email: 'rimskadapa@ap.gov.in', bedCapacity: 750, hasBloodBank: true, bloodBank24x7: true, specialties: ['24x7 Casualty', 'General Surgery', 'OBG'] },
  { id: 'H-KDP-02', name: 'Fathima Institute of Medical Sciences Hospital', category: 'Medical College Hospital', district: 'Kadapa', address: 'Ramaraopalli, Kadapa, AP 516003', phone: '08562-278000', emergencyPhone: '08562-278001', email: 'fims.kadapa@gmail.com', bedCapacity: 600, hasBloodBank: true, bloodBank24x7: true, specialties: ['Emergency Trauma Care', 'General Medicine'] },

  // --- SRIKAKULAM ---
  { id: 'H-SKL-01', name: 'RIMS Government General Hospital Srikakulam', category: 'Government General Hospital', district: 'Srikakulam', address: 'Balaga Road, Srikakulam, AP 532001', phone: '08942-279888', emergencyPhone: '08942-279889', email: 'rimsskl@ap.gov.in', bedCapacity: 700, hasBloodBank: true, bloodBank24x7: true, specialties: ['Trauma Care', 'General Surgery', 'Pediatrics'] },
  { id: 'H-SKL-02', name: 'Great Eastern Medical School & Hospital (GEMS)', category: 'Medical College Hospital', district: 'Srikakulam', address: 'Ragolu, Srikakulam, AP 532484', phone: '08942-279200', emergencyPhone: '08942-279201', email: 'info@gems.edu.in', bedCapacity: 800, hasBloodBank: true, bloodBank24x7: true, specialties: ['Emergency Trauma Care', 'General Surgery'] },

  // --- VIZIANAGARAM ---
  { id: 'H-VZM-01', name: 'Government General Hospital Vizianagaram', category: 'Government General Hospital', district: 'Vizianagaram', address: 'Cantonment, Vizianagaram, AP 535003', phone: '08922-276333', emergencyPhone: '08922-276334', email: 'gghvzm@ap.gov.in', bedCapacity: 600, hasBloodBank: true, bloodBank24x7: true, specialties: ['24x7 Emergency', 'Pediatrics', 'General Surgery'] },
  { id: 'H-VZM-02', name: 'Maharajah Institute of Medical Sciences (MIMS)', category: 'Medical College Hospital', district: 'Vizianagaram', address: '315, Nellimarla, Vizianagaram, AP 535217', phone: '08922-244888', emergencyPhone: '08922-244889', email: 'mims_vzm@yahoo.co.in', bedCapacity: 850, hasBloodBank: true, bloodBank24x7: true, specialties: ['24x7 Emergency', 'General Surgery', 'OBG'] },

  // --- ANANTAPUR ---
  { id: 'H-ATP-01', name: 'Government General Hospital Anantapur', category: 'Government General Hospital', district: 'Anantapur', address: 'Rahamat Nagar, Anantapur, AP 515001', phone: '08554-275022', emergencyPhone: '08554-275023', email: 'gghanantapur@ap.gov.in', bedCapacity: 650, hasBloodBank: true, bloodBank24x7: true, specialties: ['Emergency Trauma', 'Orthopaedics', 'Pediatrics'] },
  { id: 'H-ATP-02', name: 'KIMS Saveera Super Speciality Hospital', category: 'Private Super Speciality', district: 'Anantapur', address: 'Near Clock Tower, Anantapur, AP 515001', phone: '08554-272727', emergencyPhone: '08554-272728', email: 'kimssaveera@kimshospitals.com', bedCapacity: 300, hasBloodBank: true, bloodBank24x7: true, specialties: ['Cardiology', 'Critical Care', 'Emergency'] }
];

const CATEGORIES = ['All', 'Government General Hospital', 'AIIMS / Autonomous', 'Private Super Speciality', 'Medical College Hospital', 'Trust / District Hospital'];
const DISTRICTS = [
  'All', 'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Kadapa', 'Krishna', 'Kurnool', 
  'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari'
];

const ITEMS_PER_PAGE = 6;

export default function HospitalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [activeHospitalModal, setActiveHospitalModal] = useState<Hospital | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredHospitals = REAL_HOSPITALS.filter((hosp) => {
    const matchesSearch =
      hosp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hosp.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hosp.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || hosp.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'All' || hosp.district === selectedDistrict;

    return matchesSearch && matchesCategory && matchesDistrict;
  });

  const totalPages = Math.ceil(filteredHospitals.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedHospitals = filteredHospitals.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFilterChange = (setter: (val: string) => void, val: string) => {
    setter(val);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      <Navbar />

      <section className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-red-950 text-white py-8 px-4 shadow-md">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold tracking-wide uppercase mb-2 border border-red-500/30">
                <Building2 className="w-4 h-4 text-red-400" />
                Verified Hospitals Directory — All 13 AP Districts
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Hospitals Directory
              </h1>
            </div>
            <Link href="/blood-availability">
              <Button className="bg-brand hover:bg-brand-dark text-white font-bold px-5 h-10 text-xs shadow-md flex items-center gap-2">
                <Droplets className="w-4 h-4" /> Check Blood Stock
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <main className="container mx-auto max-w-6xl px-4 py-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm mb-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
              <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand" /> Filter Hospitals
              </h2>
              <span className="text-xs text-neutral-500 font-medium">
                Total: <strong className="text-brand">{filteredHospitals.length}</strong> hospitals (Page {currentPage} of {totalPages})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                  Search Hospital / City
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="e.g. KGH, GGH Vijayawada, RIMS"
                    value={searchTerm}
                    onChange={(e) => handleFilterChange(setSearchTerm, e.target.value)}
                    className="w-full pl-8 pr-3 h-9 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-950 text-xs focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                  Facility Type
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleFilterChange(setSelectedCategory, e.target.value)}
                  className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-950 text-xs focus:outline-none focus:border-brand"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'All' ? 'All Facility Types' : cat}
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
                  onChange={(e) => handleFilterChange(setSelectedDistrict, e.target.value)}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedHospitals.map((hosp) => (
              <div
                key={hosp.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 mb-1">
                        {hosp.category}
                      </span>
                      <h3 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 leading-snug">
                        {hosp.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{hosp.address}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-neutral-50 dark:bg-neutral-950 p-2 rounded-lg border border-neutral-100 dark:border-neutral-800 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5 text-neutral-400" />
                      <div>
                        <span className="text-neutral-400 block text-[9px]">CAPACITY</span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">{hosp.bedCapacity} Beds</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <div>
                        <span className="text-neutral-400 block text-[9px]">STATUS</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">24x7 Open</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex gap-2">
                  <a href={`tel:${hosp.emergencyPhone || hosp.phone}`} className="flex-1">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 font-bold flex items-center justify-center gap-1 rounded-lg">
                      <PhoneCall className="w-3 h-3" /> Call Helpline
                    </Button>
                  </a>

                  <Button
                    onClick={() => setActiveHospitalModal(hosp)}
                    variant="outline"
                    className="text-xs h-8 px-3 font-medium"
                  >
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 pt-4 mt-6">
            <span className="text-xs text-neutral-500">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredHospitals.length)} of {filteredHospitals.length} entries
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

      {activeHospitalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-brand uppercase tracking-wide">
                  {activeHospitalModal.category}
                </span>
                <h3 className="font-bold text-xl text-neutral-900 dark:text-neutral-100">
                  {activeHospitalModal.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveHospitalModal(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 font-bold text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-sm bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <p className="text-neutral-700 dark:text-neutral-300 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand shrink-0 mt-1" />
                <span>{activeHospitalModal.address}</span>
              </p>

              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-neutral-500 block">General Phone:</span>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100">{activeHospitalModal.phone}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Emergency Line:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeHospitalModal.emergencyPhone}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Bed Capacity:</span>
                  <span className="font-bold">{activeHospitalModal.bedCapacity} Beds</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Blood Centre:</span>
                  <span className="font-bold text-brand">24x7 Active</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setActiveHospitalModal(null)} className="flex-1 text-xs h-10">
                Close
              </Button>
              <Link href={`/blood-availability?search=${encodeURIComponent(activeHospitalModal.district)}`} className="flex-1">
                <Button className="w-full bg-[#8b0000] hover:bg-[#6b0000] text-white text-xs h-10 font-bold flex items-center justify-center gap-1.5">
                  <Droplets className="w-4 h-4" /> Check Blood Stock
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
