'use client';

import { useEffect, useRef } from 'react';

const Gallery = () => {
  const images = [
    '/assets/images/ADS00529.jpg',
    '/assets/images/ADS00598.jpg',
    '/assets/images/ADS00467.jpg',
    '/assets/images/ADS00008.jpg',
    '/assets/images/ADS00119.jpg',
    '/assets/images/ADS00128.jpg',
  ];

  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show-gallery');
          }
        });
      },
      {
        threshold: 0.15,
      },
    );

    refs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="bg-black px-4 py-24 md:px-10">
      <div className="mx-auto max-w-4xl">
        {/* HEADER */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
            Visual Archive
          </p>

          <h2 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
            Captured Moments
          </h2>

          <p className="mt-6 text-sm leading-relaxed text-neutral-400 md:text-base">
            Kami percaya setiap perjalanan memiliki detail yang layak dihormati.
            Dari momen paling sederhana hingga hari paling penting, kami
            menerjemahkannya menjadi visual yang tenang, elegan, dan abadi.
          </p>
        </div>

        {/* GALLERY */}
        <div className="mt-16 space-y-6">
          {images.map((img, i) => (
            <div
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="gallery-item group overflow-hidden rounded-2xl bg-neutral-900"
              style={{
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <img
                src={img}
                alt={`Gallery ${i + 1}`}
                loading="lazy"
                className="w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:brightness-110"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .gallery-item {
          opacity: 0;
          transform: translateY(80px) scale(0.96);
          transition:
            opacity 1s ease,
            transform 1s ease;
        }

        .gallery-item.show-gallery {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      `}</style>
    </section>
  );
};

export { Gallery };
