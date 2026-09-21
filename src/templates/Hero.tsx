'use client';

import Image from 'next/image';
import { Background } from '../background/Background';
import { Button } from '../button/Button';
import { trackWA } from '@/utils/tracking';

// Mencegah error TypeScript pada window.fbq saat build
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

const Hero = () => {

  const openWA = (label: string) => {
    trackWA(label);

    const message = "Halo Radeya, saya tertarik untuk Tanya tanya jasa foto wisuda.";
    const url = `https://wa.me/628211251570?text=${encodeURIComponent(message)}`;

    // Menggunakan window.location.href agar langsung redirect tanpa diblokir popup blocker di Safari/In-App Browser Instagram
    window.location.href = url;
  };

  const firePricelistEvent = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: 'Hero_CTA_Pricelist_Click',
        segment: 'graduation'
      });
    }
  };

  return (
    <Background color="bg-black">

      {/* NAVBAR */}
      <div className="fixed left-0 top-0 z-50 flex w-full justify-end px-5 py-5 md:px-16 md:py-8">
        <button
          onClick={() => openWA('hero_wa')}
          className="flex items-center gap-1.5 rounded-full border border-white/30 bg-black/40 px-3.5 py-2 text-[9px] tracking-[0.18em] text-white backdrop-blur-md transition hover:bg-white hover:text-black md:px-5 md:py-2.5 md:text-[11px]"
        >
          <Image
            src="/assets/images/Whatsapp.png"
            alt="WhatsApp"
            width={14}
            height={14}
            className="h-3.5 w-3.5 md:h-4 md:w-4"
          />
          <span>KONSULTASI VIA WA →</span>
        </button>
      </div>

      {/* FLOATING WA */}
      <button
        onClick={() => openWA('floating_wa')}
        className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-110 md:bottom-6 md:right-6 md:h-14 md:w-14"
      >
        <Image
          src="/assets/images/Whatsapp.png"
          alt="WhatsApp"
          width={28}
          height={28}
          className="h-5 w-5 md:h-7 md:w-7"
        />
      </button>

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">

        <Image
          src="/assets/images/ADS00680.jpg"
          alt="Graduation"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex min-h-screen items-center px-5 pt-10 md:px-20">

          <div className="max-w-[320px] md:max-w-[500px]">

            <p className="mb-4 text-[9px] uppercase tracking-[0.3em] text-neutral-300 md:mb-6 md:text-sm">
              More than portraits.
            </p>

            <h1 className="whitespace-pre-line text-[1.6rem] font-semibold leading-[1] text-white md:text-6xl">
              A visual story{"\n"}of your final chapter.
            </h1>

            <p className="mt-4 max-w-[260px] text-[12px] text-neutral-300 md:mt-8 md:max-w-xl md:text-xl">
              Crafted for graduates who want their memories
              to feel timeless, emotional, and cinematic.
            </p>

            {/* CTA */}
            <div className="mt-6 md:mt-12 scale-75 origin-left md:scale-100">
              <a href="#leadform" onClick={firePricelistEvent}>
                <Button>Get Pricelist →</Button>
              </a>
            </div>

          </div>
        </div>
      </section>
    </Background>
  );
};

export { Hero };
