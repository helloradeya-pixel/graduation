import { Meta } from '../layout/Meta';
import { AppConfig } from '../utils/AppConfig';
import { Banner } from './Banner';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { Gallery } from './Gallery';
import { Testimonial } from './Testimonial';
import { LeadForm } from './LeadForm';

const Base = () => (
  <div className="text-gray-600 antialiased">
    <Meta title={AppConfig.title} description={AppConfig.description} />
    <Hero />
    <Gallery />
     <Testimonial />
    <LeadForm />
    <Banner />
    <Footer />
  </div>
);

export { Base };
