import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import APBloodDashboard from '@/components/ap-blood-dashboard';
import WhoCanDonate from '@/components/who-can-donate';
import HowDonationWorks from '@/components/how-donation-works';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        
        {/* 1. Who Can Donate Blood? Interactive Questionnaire Section */}
        <WhoCanDonate />

        {/* 2. Andhra Pradesh eRaktKosh Style Dashboard */}
        <APBloodDashboard />

        {/* 3. Hero Section */}
        <section className="relative overflow-hidden bg-background pt-16 md:pt-24 lg:pt-32 pb-16 md:pb-24">
          <div className="absolute inset-0 bg-grid-neutral-100/[0.04] bg-[size:32px_32px]"></div>
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-brand/5 to-transparent blur-3xl"></div>
          
          <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
              Every Drop Counts.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-light">
                Every Life Matters.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-neutral-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              The intelligent digital blood bank ecosystem connecting donors, hospitals, and recipients in real-time. Find blood in minutes, not hours.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register?role=donor">
                <Button size="lg" className="w-full sm:w-auto bg-brand hover:bg-brand-dark shadow-tier-1 hover:shadow-tier-2 transition-all">
                  Become a Donor
                </Button>
              </Link>
            </div>
            

          </div>
        </section>

        {/* 4. How Donation Works Section (Using exact website background) */}
        <HowDonationWorks />
      </main>
      
      <footer className="bg-neutral-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold mx-auto mb-4">
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
