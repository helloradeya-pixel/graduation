'use client';

import { useEffect, useRef, useState } from 'react';

const Gallery = () => {
  const images: string[] = [
    '/assets/images/images1.jpg',
    '/assets/images/images2.jpg',
    '/assets/images/images3.jpg',
    '/assets/images/images4.jpg',
    '/assets/images/images5.jpg',
    '/assets/images/images6.jpg',
    '/assets/images/images7.jpg',
    '/assets/images/images8.jpg',
    '/assets/images/images9.jpg',
  ];

  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      { threshold: 0.15 }
    );

    refs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-black px-4 py-20 md:px-10">
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
            Love stories captured in cinematic frames—timeless memories from engagement to wedding day.
          </p>
        </div>

        {/* GRID IG STYLE */}
        <div className="mt-14 grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-3">
          {images.map((img, i) => (
            <div
              key={img}
              ref={(el) => {
                refs.current[i] = el;
              }}
              onClick={() => setActiveImage(img)}
              className="item aspect-[4/5] overflow-hidden rounded-xl bg-neutral-900 cursor-pointer"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <img
                src={img}
                alt={`Gallery ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 ease-out hover:scale-110 hover:brightness-110"
              />
            </div>
          ))}
        </div>
      </div>

      {/* MODAL / LIGHTBOX */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setActiveImage(null)}
        >
          <img
            src={activeImage}
            alt="Preview"
            className="max-h-full max-w-full rounded-xl shadow-2xl"
          />
        </div>
      )}

      {/* ANIMATION STYLE */}
      <style jsx>{`
        .item {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
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
