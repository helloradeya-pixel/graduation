import Link from 'next/link';

declare const fbq: any;

const Footer = () => {
  return (
    <footer className="bg-black py-16 text-white">
      <div className="mx-auto max-w-6xl px-8 md:px-16">

        {/* TOP */}
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row">

          {/* BRAND */}
          <div>
            <h3 className="text-xl font-semibold tracking-wide">
              Radeya Photography
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

          {/* WA */}
          <Link
            href="https://wa.me/628211251570"
            onClick={() => {
              // @ts-ignore
              fbq('track', 'Lead');
            }}
            className="rounded-full border border-white/20 px-5 py-2 text-xs tracking-[0.2em] transition hover:bg-white hover:text-black"
          >
            KONSULTASI
          </Link>
        </div>

        {/* BOTTOM */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} Radeya Photography. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export { Footer };
