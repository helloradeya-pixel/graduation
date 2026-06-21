import { Background } from '../background/Background';
import { Button } from '../button/Button';
import { trackWA, trackLead } from '@/utils/tracking';

const Hero = () => {

  const openWA = (label) => {
    // Label membedakan asal klik (navbar atau floating)
    trackWA(label);

    // Pesan otomatis yang akan muncul di WhatsApp klien
    const message = "Halo Radeya, saya tertarik untuk Tanya tanya jasa foto wisuda.";
    const url = `https://wa.me/628211251570?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      window.open(url, '_blank');
    }, 150);
  };

  const firePricelistEvent = () => {
    trackLead('hero_cta');
  };

  return (
    <Background color="bg-black">

      {/* NAVBAR */}
      <div className="fixed left-0 top-0 z-50 flex w-full justify-end px-5 py-5 md:px-16 md:py-8">
        <button
          onClick={() => openWA('hero_wa')}
          className="rounded-full border border-white/20 px-4 py-2 text-[9px] tracking-[0.22em] text-white transition hover:bg-white hover:text-black md:px-5 md:text-[11px]"
        >
          KONSULTASI GRATIS →
        </button>
      </div>

      {/* FLOATING WA */}
      <button
        onClick={() => openWA('floating_wa')}
        className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-110 md:bottom-6 md:right-6 md:h-14 md:w-14"
      >
        <img
          src="/assets/images/Whatsapp.png"
          alt="WhatsApp"
          className="h-5 w-5 md:h-7 md:w-7"
        />
      </button>

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">

        <img
          src="/assets/images/ADS00680.jpg"
          alt="Graduation"
          className="absolute inset-0 h-full w-full object-cover object-center"
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
              <div onClick={firePricelistEvent}>
                <a href="#leadform">
                  <Button>Get Pricelist →</Button>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </Background>
  );
};

export { Hero };
