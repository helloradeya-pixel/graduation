import { useEffect } from 'react';

import { Meta } from './Meta';
import { AppConfig } from '../../utils/AppConfig';
import { Banner } from './Banner';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { Gallery } from './Gallery';
import { Testimonial } from './Testimonial';
import { LeadForm } from './LeadForm';

const Couple = () => {
  // PAGE TRACKING
  useEffect(() => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view_couple', {
        page: 'couple',
        source: 'landing_page',
      });
    }

    // Meta Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('trackCustom', 'ViewCouplePage', {
        page: 'couple',
      });
    }
  }, []);

  return (
    <div className="text-gray-600 antialiased">
      <Meta
        title={AppConfig.title}
        description={AppConfig.description}
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
