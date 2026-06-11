import { useEffect } from 'react';

import { Meta } from './Meta';
import { AppConfig } from '../../utils/AppConfig';
import { Hero } from './Hero';
import { Gallery } from './Gallery';
import { Testimonial } from './Testimonial';
import { LeadForm } from './LeadForm';
import { Banner } from './Banner';
import { Footer } from './Footer';

import { trackCoupleView } from '@/utils/tracking';

const Couple = () => {
  // TRACK PAGE VIEW (META + GA4)
  useEffect(() => {
    trackCoupleView();
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
