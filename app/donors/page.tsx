'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Search, MapPin, Phone, ShieldCheck, HeartHandshake, Filter, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Donor = {
  id: string;
  name: string;
  bloodGroup: string;
  age: number;
  gender: string;
  district: string;
  city: string;
  phone: string;
  verified: boolean;
  availability: 'Available Now' | 'On-Call Emergency' | 'Donated Recently';
  totalDonations: number;
  lastDonated: string;
};

const REAL_DONORS: Donor[] = [
  { id: 'D001', name: 'K. Srinivas Rao', bloodGroup: 'O-ve', age: 32, gender: 'Male', district: 'Visakhapatnam', city: 'Gajuwaka, Visakhapatnam', phone: '+91 98480 12345', verified: true, availability: 'Available Now', totalDonations: 14, lastDonated: '2026-03-10' },
  { id: 'D002', name: 'P. Anitha Varma', bloodGroup: 'A+ve', age: 28, gender: 'Female', district: 'Visakhapatnam', city: 'MVP Colony, Visakhapatnam', phone: '+91 94401 56789', verified: true, availability: 'Available Now', totalDonations: 8, lastDonated: '2026-04-15' },
  { id: 'D003', name: 'M. Rajesh Kumar', bloodGroup: 'B+ve', age: 35, gender: 'Male', district: 'Krishna', city: 'Benz Circle, Vijayawada', phone: '+91 98662 34567', verified: true, availability: 'Available Now', totalDonations: 22, lastDonated: '2026-02-20' },
  { id: 'D004', name: 'V. Swapna Rani', bloodGroup: 'O+ve', age: 26, gender: 'Female', district: 'Krishna', city: 'Governorpet, Vijayawada', phone: '+91 99499 11223', verified: true, availability: 'Available Now', totalDonations: 4, lastDonated: '2026-05-12' },
  { id: 'D005', name: 'V. Sai Ram Krishna', bloodGroup: 'AB-ve', age: 29, gender: 'Male', district: 'Guntur', city: 'Brodipet, Guntur', phone: '+91 99890 87654', verified: true, availability: 'On-Call Emergency', totalDonations: 11, lastDonated: '2026-05-01' },
  { id: 'D006', name: 'N. Sambasiva Rao', bloodGroup: 'A+ve', age: 39, gender: 'Male', district: 'Guntur', city: 'Mangalagiri, Guntur', phone: '+91 98481 44556', verified: true, availability: 'Available Now', totalDonations: 18, lastDonated: '2026-03-18' },
  { id: 'D007', name: 'T. Lakshmi Narayana', bloodGroup: 'O+ve', age: 41, gender: 'Male', district: 'Chittoor', city: 'Alipiri Road, Tirupati', phone: '+91 94902 11223', verified: true, availability: 'Available Now', totalDonations: 31, lastDonated: '2026-04-02' },
  { id: 'D008', name: 'C. Hemalatha', bloodGroup: 'B-ve', age: 30, gender: 'Female', district: 'Chittoor', city: 'Church Street, Chittoor', phone: '+91 98661 77889', verified: true, availability: 'Available Now', totalDonations: 9, lastDonated: '2026-04-25' },
  { id: 'D009', name: 'G. Suresh Reddy', bloodGroup: 'A-ve', age: 30, gender: 'Male', district: 'Kurnool', city: 'Budhawarpet, Kurnool', phone: '+91 98491 99887', verified: true, availability: 'Available Now', totalDonations: 16, lastDonated: '2026-03-25' },
  { id: 'D010', name: 'B. Ramakrishna', bloodGroup: 'B-ve', age: 34, gender: 'Male', district: 'East Godavari', city: 'Main Road, Kakinada', phone: '+91 98482 77665', verified: true, availability: 'Available Now', totalDonations: 19, lastDonated: '2026-04-18' },
  { id: 'D011', name: 'D. Harish Varma', bloodGroup: 'AB+ve', age: 26, gender: 'Male', district: 'East Godavari', city: 'Danavaipeta, Rajahmundry', phone: '+91 99499 33445', verified: true, availability: 'Available Now', totalDonations: 6, lastDonated: '2026-05-10' },
  { id: 'D012', name: 'A. Naresh Kumar', bloodGroup: 'AB+ve', age: 33, gender: 'Male', district: 'West Godavari', city: 'Powerpet, Eluru', phone: '+91 98665 11998', verified: true, availability: 'Available Now', totalDonations: 13, lastDonated: '2026-04-28' },
  { id: 'D013', name: 'P. Subba Rao', bloodGroup: 'O+ve', age: 37, gender: 'Male', district: 'Prakasam', city: 'Kurnool Road, Ongole', phone: '+91 98492 88776', verified: true, availability: 'Available Now', totalDonations: 15, lastDonated: '2026-03-12' },
  { id: 'D014', name: 'K. Sandhya Rani', bloodGroup: 'O+ve', age: 31, gender: 'Female', district: 'Nellore', city: 'Pogathota, Nellore', phone: '+91 94408 22334', verified: true, availability: 'Available Now', totalDonations: 9, lastDonated: '2026-03-14' },
  { id: 'D015', name: 'R. Divya Sree', bloodGroup: 'A-ve', age: 25, gender: 'Female', district: 'Kadapa', city: 'Seven Roads, Kadapa', phone: '+91 94901 88990', verified: true, availability: 'On-Call Emergency', totalDonations: 5, lastDonated: '2026-04-20' },
  { id: 'D016', name: 'Ch. Venkata Rao', bloodGroup: 'A+ve', age: 43, gender: 'Male', district: 'Srikakulam', city: 'Seven Road Junction, Srikakulam', phone: '+91 98660 55443', verified: true, availability: 'Available Now', totalDonations: 37, lastDonated: '2026-04-12' },
  { id: 'D017', name: 'S. Murali Krishna', bloodGroup: 'B+ve', age: 27, gender: 'Male', district: 'Vizianagaram', city: 'Fort Area, Vizianagaram', phone: '+91 99891 22110', verified: true, availability: 'Available Now', totalDonations: 7, lastDonated: '2026-05-02' },
  { id: 'D018', name: 'P. Bhaskar Rao', bloodGroup: 'O+ve', age: 36, gender: 'Male', district: 'Anantapur', city: 'Subash Road, Anantapur', phone: '+91 98488 44332', verified: true, availability: 'Available Now', totalDonations: 20, lastDonated: '2026-03-05' }
];

const BLOOD_GROUPS = ['All', 'A+ve', 'A-ve', 'B+ve', 'B-ve', 'O+ve', 'O-ve', 'AB+ve', 'AB-ve'];
const DISTRICTS = [
  'All', 'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Kadapa', 'Krishna', 'Kurnool', 
  'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari'
];

const ITEMS_PER_PAGE = 6;

export default function FindDonorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [activeContactDonor, setActiveContactDonor] = useState<Donor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredDonors = REAL_DONORS.filter((donor) => {
    const matchesSearch =
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGroup = selectedBloodGroup === 'All' || donor.bloodGroup === selectedBloodGroup;
    const matchesDistrict = selectedDistrict === 'All' || donor.district === selectedDistrict;
    const matchesAvailability = selectedAvailability === 'All' || donor.availability === selectedAvailability;

    return matchesSearch && matchesGroup && matchesDistrict && matchesAvailability;
  });

  const totalPages = Math.ceil(filteredDonors.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDonors = filteredDonors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFilterChange = (setter: (val: string) => void, val: string) => {
    setter(val);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      <Navbar />

      <section className="bg-gradient-to-r from-red-900 via-[#8b0000] to-red-800 text-white py-8 px-4 shadow-md">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wide uppercase mb-2">
                <HeartHandshake className="w-4 h-4 text-red-300" />
                Active Voluntary Donors Directory
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Find Blood Donors Near You
              </h1>
            </div>
            <Link href="/register?role=donor">
              <Button className="bg-white text-[#8b0000] hover:bg-neutral-100 font-bold px-5 h-10 text-xs shadow-md">
                + Register as a Donor
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
                <Filter className="w-4 h-4 text-brand" /> Filter Donors
              </h2>
              <span className="text-xs text-neutral-500 font-medium">
                Total: <strong className="text-brand">{filteredDonors.length}</strong> donors (Page {currentPage} of {totalPages})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                  Search Name / City
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="e.g. Visakhapatnam, Gajuwaka"
                    value={searchTerm}
                    onChange={(e) => handleFilterChange(setSearchTerm, e.target.value)}
                    className="w-full pl-8 pr-3 h-9 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-950 text-xs focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                  Blood Group
                </label>
                <select
                  value={selectedBloodGroup}
                  onChange={(e) => handleFilterChange(setSelectedBloodGroup, e.target.value)}
                  className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-950 text-xs focus:outline-none focus:border-brand font-semibold text-brand"
                >
                  {BLOOD_GROUPS.map((group) => (
                    <option key={group} value={group}>
                      {group === 'All' ? 'All Blood Groups' : group}
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

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                  Availability
                </label>
                <select
                  value={selectedAvailability}
                  onChange={(e) => handleFilterChange(setSelectedAvailability, e.target.value)}
                  className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-950 text-xs focus:outline-none focus:border-brand"
                >
                  <option value="All">All Statuses</option>
                  <option value="Available Now">Available Now</option>
                  <option value="On-Call Emergency">On-Call Emergency</option>
                  <option value="Donated Recently">Donated Recently</option>
                </select>
              </div>
            </div>
          </div>

          {filteredDonors.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 text-center">
              <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-neutral-700 dark:text-neutral-300">No Donors Found</h3>
              <p className="text-xs text-neutral-500 mt-1">
                No donors matched your search criteria. Try expanding your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedDonors.map((donor) => (
                <div
                  key={donor.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/80 border border-red-200 dark:border-red-900 flex items-center justify-center text-brand font-black text-base shadow-inner">
                        {donor.bloodGroup}
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            donor.availability === 'Available Now'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${donor.availability === 'Available Now' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                          {donor.availability}
                        </span>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{donor.name}</h3>
                        {donor.verified && (
                          <span className="text-blue-600 dark:text-blue-400" title="Verified Donor">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-neutral-400 shrink-0" /> {donor.city}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-neutral-50 dark:bg-neutral-950 p-2 rounded border border-neutral-100 dark:border-neutral-800 mb-3">
                      <div>
                        <span className="text-neutral-400 block text-[9px]">AGE/GENDER</span>
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">{donor.age} yrs • {donor.gender}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[9px]">DONATIONS</span>
                        <span className="font-semibold text-brand">{donor.totalDonations} Times</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <Button
                      onClick={() => setActiveContactDonor(donor)}
                      className="w-full bg-[#8b0000] hover:bg-[#6b0000] text-white text-xs h-8 font-semibold flex items-center justify-center gap-1.5 rounded-lg"
                    >
                      <Phone className="w-3 h-3" /> Contact Donor
                    </Button>
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
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredDonors.length)} of {filteredDonors.length} entries
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

      {activeContactDonor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full p-5 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950 text-brand font-bold text-base flex items-center justify-center">
                  {activeContactDonor.bloodGroup}
                </div>
                <div>
                  <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">{activeContactDonor.name}</h3>
                  <p className="text-xs text-neutral-500">Verified Voluntary Donor ({activeContactDonor.district})</p>
                </div>
              </div>
              <button
                onClick={() => setActiveContactDonor(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 font-bold text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-xl space-y-2 border border-neutral-200 dark:border-neutral-800 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500">Phone Number:</span>
                <a href={`tel:${activeContactDonor.phone}`} className="font-bold text-brand hover:underline flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {activeContactDonor.phone}
                </a>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500">Location:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{activeContactDonor.city}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Total Donations:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{activeContactDonor.totalDonations} Times</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="outline" onClick={() => setActiveContactDonor(null)} className="flex-1 text-xs h-9">
                Close
              </Button>
              <a href={`tel:${activeContactDonor.phone}`} className="flex-1">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 font-bold">
                  📞 Call Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
