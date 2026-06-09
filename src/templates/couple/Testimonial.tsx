'use client';

import { useEffect, useRef } from 'react';

const testimonials = [
  {
    name: 'Regina Angelica.M',
    image: '/assets/images/client-4.jpg',
    text: 'Hasilnya semuanya bagus, pelayanannya bintang 5 banget, overall oke. Sehat terus buat kknyaaa.',
  },
  {
    name: 'Niken ayu wulandari',
    image: '/assets/images/client-2.jpg',
    text: 'rekomendedd untuk foto wisuda dan acara kalian lainnya,jujur puass bangett sama hasilnyaa,yang gbisa gaya kaya akuu pasti sukaa karna kakaknya sabar dan mau mengarahkan posenyaa gaissss.',
  },
  {
    name: 'Maritza Salwa Nabila',
    image: '/assets/images/client-3.jpg',
    text: 'tim radeya top!!! ramah & sabar bgtttt terus aktif jg selalu mengarahkan gayanyaaaa. makasi radeyaa puas sekali servicesnyaa!!!.',
  },
  {
    name: 'Ghazy Rasyid',
    image: '/assets/images/client-1.jpg',
    text: 'KERENNNNN!!!! awalnya ekspektasi biasa aja, tapi hasilnya GILA bagus banget. Admin ramah 👍 sukses terus Radeya!!!',
  },
];

const Star = () => <span className="text-yellow-400">★</span>;

const Testimonial = () => {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const paused = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const speed = 0.4;
    const maxScroll = el.scrollWidth / 2;

    const animate = () => {
      if (!paused.current && el) {
        scrollRef.current += speed;

        if (scrollRef.current >= maxScroll) {
          scrollRef.current = 0;
        }

        el.scrollLeft = scrollRef.current;
      }

      requestAnimationFrame(animate);
    };

    const frame = requestAnimationFrame(animate);

    const stop = () => (paused.current = true);
    const start = () => (paused.current = false);

    el.addEventListener('touchstart', stop);
    el.addEventListener('touchend', start);
    el.addEventListener('mouseenter', stop);
    el.addEventListener('mouseleave', start);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('touchstart', stop);
      el.removeEventListener('touchend', start);
      el.removeEventListener('mouseenter', stop);
      el.removeEventListener('mouseleave', start);
    };
  }, []);

  return (
    <section className="bg-black py-24 text-white overflow-hidden">
      <div className="mx-auto max-w-6xl px-8 md:px-16">

        {/* HEADER */}
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">
            Google Reviews
          </p>

          <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
            Trusted Moments, Captured Forever
          </h2>

          <div className="mt-6 flex items-center gap-3 text-sm text-neutral-300">
            <div className="flex">
              <Star /><Star /><Star /><Star /><Star />
            </div>

            <span className="text-yellow-400 font-medium">4.9/5</span>
            <span className="text-neutral-400">• 1,200+ Reviews</span>
          </div>
        </div>

        {/* SLIDER */}
        <div
          ref={ref}
          className="mt-14 flex gap-6 overflow-hidden"
        >
          {[...testimonials, ...testimonials].map((item, i) => (
            <div
              key={i}
              className="min-w-[320px] rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition duration-300 hover:scale-[1.02]"
            >
              <div className="mb-4 flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-10 w-10 rounded-full object-cover border border-white/20"
                />

                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <div className="flex text-yellow-400 text-xs">
                    <Star /><Star /><Star /><Star /><Star />
                  </div>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-neutral-300">
                “{item.text}”
              </p>

              <p className="mt-4 text-xs text-neutral-500">
                Source: Google Reviews
              </p>
            </div>
          ))}
        </div>

        {/* CTA BUTTON (BELOW SLIDER) */}
        <div className="mt-10 flex justify-center">
          <a
            href="https://www.google.com/maps?cid=0x2e4201b650f556b9:0x5dea0077ac2e825a"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-medium transition hover:bg-neutral-200"
          >
            Lihat Google Reviews
            <span className="text-lg">↗</span>
          </a>
        </div>

      </div>
    </section>
  );
};

export { Testimonial };
