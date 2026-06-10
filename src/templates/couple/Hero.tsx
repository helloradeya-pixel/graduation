import Link from 'next/link';
import { Background } from './Background';
import { Button } from './Button';

const Hero = () => (
  <Background color="bg-black">

    {/* NAVBAR */}
    <div className="fixed left-0 top-0 z-50 flex w-full justify-end px-5 py-5 md:px-16 md:py-8">
      <a
        href="https://wa.me/628211251570"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Lead');
          }
        }}
      >
        <button
          className="
            rounded-full
            border border-white/20
            px-4 py-2
            text-[9px]
            tracking-[0.22em]
            text-white
            transition duration-300
            hover:bg-white
            hover:text-black
            md:px-5
            md:text-[11px]
          "
        >
          KONSULTASI GRATIS →
        </button>
      </a>
    </div>

    {/* FLOATING WHATSAPP BUTTON */}
    <a
      href="https://wa.me/628211251570"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Lead');
        }
      }}
      className="fixed bottom-5 right-5 z-50 md:bottom-6 md:right-6"
    >
      <div
        className="
          flex h-11 w-11
          items-center justify-center
          rounded-full
          bg-white
          shadow-lg
          transition
          hover:scale-110
          md:h-14 md:w-14
        "
      >
        <img
          src="/assets/images/Whatsapp.png"
          alt="WhatsApp"
          className="h-5 w-5 md:h-7 md:w-7"
        />
      </div>
    </a>

    {/* HERO SECTION */}
    <section className="relative min-h-screen overflow-hidden">

      {/* BACKGROUND */}
      <img
        src="/assets/images/Hero1.jpg"
        alt="Graduation"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50" />

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-screen items-center px-5 pt-10 md:px-20">

        <div className="max-w-[320px] md:max-w-[500px]">

          {/* SMALL TEXT */}
          <p className="mb-4 text-[9px] uppercase tracking-[0.3em] text-neutral-300 md:mb-6 md:text-sm">
            More than just memories.
          </p>

          {/* HEADING */}
          <h1 className="whitespace-pre-line text-[1.6rem] font-semibold leading-[1] tracking-[-0.03em] text-white md:text-6xl">
            A visual story
            {'\n'}
            of two hearts.
          </h1>

          {/* DESCRIPTION */}
          <p className="mt-4 max-w-[260px] text-[12px] leading-[1.5] text-neutral-300 md:mt-8 md:max-w-xl md:text-xl">
            We capture love in its most honest and timeless form.
          </p>

          {/* BUTTON */}
          <div className="mt-6 md:mt-12 scale-75 origin-left md:scale-100">
            <Link href="#leadform">
              <Button>Get Pricelist →</Button>
            </Link>
          </div>

          {/* STORY */}
          <div className="mt-7 md:mt-14">
            <p className="max-w-[260px] text-[12px] leading-[1.6] text-neutral-300 md:max-w-2xl md:text-xl">
              From the quiet everyday moments
              <br />
              to the milestones you only live once,
              <br />
              we turn your story into timeless memories.
            </p>
          </div>

          {/* RATING */}
          <div className="mt-7 md:mt-10">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-[10px] text-neutral-300 backdrop-blur-sm md:gap-3 md:text-sm">

              <p className="tracking-[0.15em] text-white">
                ★ ★ ★ ★ ★
              </p>

              <div className="h-2 w-px bg-white/20" />

              <p className="text-white">
                942+ teman percaya
              </p>

            </div>

            <p className="mt-2 text-[10px] text-neutral-400 md:text-sm">
              Trusted by couples across journeys
            </p>

          </div>

        </div>
      </div>
    </section>
  </Background>
);

export { Hero };
