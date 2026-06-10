import Link from 'next/link';

const Footer = () => {

  const fireWAEvent = () => {
    if (typeof window !== 'undefined') {

      // META PIXEL (GRADUATION SEGMENT)
      window.fbq?.('track', 'Contact', {
        content_name: 'graduation_footer_wa',
        content_category: 'graduation',
      });

      // GA4
      window.gtag?.('event', 'click_whatsapp', {
        event_category: 'graduation',
        event_label: 'footer_wa',
      });
    }
  };

  return (
    <footer className="bg-black py-16 text-white">
      <div className="mx-auto max-w-6xl px-8 md:px-16">

        {/* TOP */}
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row">

          {/* BRAND */}
          <div>
            <h3 className="text-xl font-semibold tracking-wide">
              Radeya Graduation
            </h3>

            <p className="mt-2 text-sm text-neutral-400">
              Capturing your final chapter in a cinematic way.
            </p>
          </div>

          {/* NAV */}
          <div className="flex gap-6 text-sm text-neutral-400">
            <Link href="#hero">Home</Link>
            <Link href="#gallery">Gallery</Link>
            <Link href="#leadform">Booking</Link>
          </div>

          {/* WA BUTTON */}
          <button
            onClick={fireWAEvent}
            className="rounded-full border border-white/20 px-5 py-2 text-xs tracking-[0.2em] transition hover:bg-white hover:text-black"
          >
            KONSULTASI
          </button>

        </div>

        {/* BOTTOM */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} Radeya Graduation. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export { Footer };
