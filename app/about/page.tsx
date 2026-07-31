import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, Shield, Users, Clock, MapPin, Activity } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-[#8b0000] to-[#5a0000] text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <span className="bg-red-500/20 text-red-200 border border-red-500/30 text-xs px-4 py-1.5 rounded-full font-semibold uppercase tracking-wider">
              Our Mission
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-6 mb-6">
              Saving Lives Through Connection
            </h1>
            <p className="text-lg md:text-xl text-red-100 leading-relaxed max-w-2xl mx-auto">
              Connecting blood donors, hospitals, and recipients across Andhra Pradesh in real-time. Because in emergencies, every second counts.
            </p>
          </div>
        </section>

        {/* Detailed Story & Photo Section */}
        <section className="py-16 md:py-24 bg-white dark:bg-neutral-900">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                  Bridging the Gap in Blood Availability
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed text-base">
                  In Andhra Pradesh, thousands of emergency situations arise daily where quick access to blood is a matter of life and death. Traditional methods of finding blood—calling friends, posting on social media, or physically checking multiple hospitals—are slow and unreliable.
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed text-base">
                  <strong>BLOOD4LIFE</strong> is a digital initiative designed to centralize and streamline this process. By aggregating real-time stock directories from over 150 blood banks and connecting a large network of active voluntary donors, we ensure that matching blood components are located within minutes.
                </p>
                
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="border-l-4 border-[#8b0000] pl-4">
                    <h4 className="text-2xl font-bold text-[#8b0000] dark:text-red-500">150+</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">Partner Blood Banks</p>
                  </div>
                  <div className="border-l-4 border-[#8b0000] pl-4">
                    <h4 className="text-2xl font-bold text-[#8b0000] dark:text-red-500">13+</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">Districts Covered</p>
                  </div>
                </div>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[450px]">
                <img 
                  src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1200&auto=format&fit=crop" 
                  alt="Voluntary Donor Giving Blood at Donation Center" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 dark:bg-black/90 backdrop-blur p-5 rounded-xl shadow-lg border border-white/20">
                    <p className="font-semibold text-[#8b0000] dark:text-red-400 text-sm mb-1">Voluntary Blood Donation Drive</p>
                    <p className="text-neutral-800 dark:text-neutral-200 text-sm font-medium leading-relaxed">
                      Every voluntary blood donation empowers medical facilities and saves up to 3 precious lives in emergency situations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Services Grid */}
        <section className="py-16 md:py-24 bg-neutral-50 dark:bg-neutral-900/50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight mb-4 text-neutral-900 dark:text-neutral-100">
                Key Platform Features
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400">
                Designed to deliver accurate information and instant connection during medical emergencies.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-neutral-900 p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950 text-[#8b0000] dark:text-red-400 rounded-lg flex items-center justify-center mb-6">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-neutral-100">Live Availability Search</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                  Search by district, blood group, and component to see live unit counts and direct contact info of the nearest holding facility.
                </p>
              </div>

              <div className="bg-white dark:bg-neutral-900 p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950 text-[#8b0000] dark:text-red-400 rounded-lg flex items-center justify-center mb-6">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-neutral-100">Camp Scheduler</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                  Stay updated with regional donation drives. Find dates, venues, organizers, and easily subscribe to get text alerts.
                </p>
              </div>

              <div className="bg-white dark:bg-neutral-900 p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950 text-[#8b0000] dark:text-red-400 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-neutral-100">Verified Blood Centers</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                  Every listed facility is registered and verified under regional health guidelines, guaranteeing medical legitimacy and quality control.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <Heart className="w-16 h-16 text-[#8b0000] mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-neutral-900 dark:text-neutral-100">
              Join Our Mission Today
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-md mx-auto">
              Whether you are looking to find blood availability or want to register as a voluntary donor, your participation saves lives.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/blood-availability">
                <Button className="w-full sm:w-auto bg-[#8b0000] hover:bg-[#6b0000] text-white">
                  Check Blood Stock
                </Button>
              </Link>
              <Link href="/register?role=donor">
                <Button variant="outline" className="w-full sm:w-auto border-neutral-300 dark:border-neutral-700">
                  Register as Donor
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-neutral-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold mx-auto mb-4 bg-[#8b0000]">
            ❤
          </div>
          <h2 className="text-xl font-bold mb-6">BLOOD4LIFE</h2>
          <p className="text-neutral-400 mb-8 max-w-md mx-auto">Building the world's most trusted, responsive, and connected blood donation ecosystem.</p>
          <div className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} BLOOD4LIFE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
