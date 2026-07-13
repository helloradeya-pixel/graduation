'use client'; // Pastikan baris ini ada jika menggunakan komponen client

import { Meta } from '../layout/Meta';
import { AppConfig } from '../utils/AppConfig';
import { Banner } from './Banner';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { Gallery } from './Gallery';
import { Testimonial } from './Testimonial';
import { LeadForm } from './LeadForm';

// Kita menambahkan properti 'title' dan 'description' agar dinamis
const Base = ({ title, description }: { title?: string; description?: string }) => (
  <div className="text-gray-600 antialiased">
    <Meta 
      title={title || AppConfig.title} 
      description={description || AppConfig.description} 
    />
    <Hero />
    <Gallery />
    <Testimonial />
    <LeadForm />
    <Banner />
    <Footer />
  </div>
);

export { Base };
