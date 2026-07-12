import { useEffect } from 'react';

import { Meta } from '../../layout/Meta';
import { AppConfig } from '../../utils/AppConfig';
import { Hero } from './Hero';
import { Gallery } from './Gallery';
import { Testimonial } from './Testimonial';
import { LeadForm } from './LeadForm';
import { Banner } from './Banner';
import { Footer } from './Footer';

import { trackCoupleView } from '@/utils/tracking';

const Couple = () => {
  // TRACK PAGE VIEW (GA4 via tracking.ts, Pixel sudah otomatis dari Meta.tsx)
  useEffect(() => {
    trackCoupleView();
  }, []);

  return (
    <div className="text-gray-600 antialiased">
      <Meta
        title={AppConfig.title}
        description={AppConfig.description}
        // Jika Anda ingin mengaktifkan Pixel Baru di halaman Couple ini, 
        // cukup tambahkan prop di bawah ini:
        // addPixelId="1413881487242621"
      />

      <Hero />
      <Gallery />
      <Testimonial />
      <LeadForm />
      <Banner />
      <Footer />
    </div>
  );
};

export { Couple };
