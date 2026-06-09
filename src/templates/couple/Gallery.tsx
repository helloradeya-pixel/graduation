'use client';

import { useEffect, useRef } from 'react';

const Gallery = () => {
  const images: string[] = [
    '/assets/images/images1.jpg',
    '/assets/images/images2.jpg',
    '/assets/images/images3.jpg',
    '/assets/images/images4.jpg',
    '/assets/images/images5.jpg',
    '/assets/images/images6.jpg',
  ];

  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    refs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-black px-4 py-24 md:px-10">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
            Visual Archive
          </p>

          <h2 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
            Captured Moments
          </h2>

          <p className="mt-6 text-sm leading-relaxed text-neutral-400 md:text-base">
            Love stories, captured in cinematic frames—timeless moments from engagement to wedding day.
          </p>
        </div>

        {/* GALLERY GRID */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {images.map((img, i) => (
            <div
              key={img}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="item overflow-hidden rounded-2xl bg-neutral-900"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <img
                src={img}
                alt={`Gallery ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 ease-out hover:scale-105 hover:brightness-110"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .item {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .item.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
};

export { Gallery };
