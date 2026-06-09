import Image from 'next/image';
import Link from 'next/link';

import { Button } from '../button/Button';

const Banner = () => (
  <section className="relative h-screen w-full overflow-hidden">
    {/* BACKGROUND IMAGE */}
    <Image
      src="/assets/images/ADS00060.jpg"
      alt="Graduation Banner"
      fill
      priority
      className="object-cover"
    />

    {/* CINEMATIC GRADIENT OVERLAY */}
    <div
      className="
        absolute
        inset-0
        bg-[linear-gradient(to_bottom,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.25)_35%,rgba(0,0,0,0.25)_65%,rgba(0,0,0,0.92)_100%)]
      "
    />

    {/* CONTENT */}
    <div
      className="
        relative
        z-10
        flex
        h-full
        items-center
        justify-center
        px-6
        text-center
      "
    >
      <div className="max-w-3xl">
        <h2
          className="
            text-4xl
            font-semibold
            leading-tight
            text-white
            md:text-6xl
          "
        ></h2>

        <p
          className="
            mx-auto
            mt-6
            max-w-2xl
            text-base
            leading-relaxed
            text-neutral-200
            md:text-xl
          "
        >
          Setiap cerita punya akhir yang layak dikenang dengan indah. Booking
          sekarang dan dapatkan konsep cinematic untuk graduation kamu.
        </p>

        <div className="mt-10">
          <Link href="#leadform">
            <Button xl>Book Your Session →</Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export { Banner };
