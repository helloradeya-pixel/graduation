import { useState, useEffect } from 'react';
import "./Radeyaphoto.css";
import { Testimonial } from "../Testimonial";

export default function RadeyaphotoPage() {
  const [isTikTok, setIsTikTok] = useState(false);

  useEffect(() => {
    // Mendeteksi apakah user membuka melalui in-app browser TikTok
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/TikTok/i.test(userAgent)) {
      setIsTikTok(true);
    }
  }, []);

  const fireWAEvent = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click_whatsapp', {
        event_category: 'bio_page',
        event_label: 'wa_admin',
      });
    }
  };

  const fireIGWedding = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click_instagram', {
        event_category: 'outbound',
        event_label: 'ig_wedding',
      });
    }
  };

  const fireIGWisuda = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click_instagram', {
        event_category: 'outbound',
        event_label: 'ig_wisuda',
      });
    }
  };

  return (
    <div className="radeyaphoto">
      <div className="hero"></div>

      <div className="profile-section">
        <img
          src="/assets/images/profile.jpg"
          alt="profile"
          className="profile-img"
        />

        <h1>Radeyaphoto</h1>

        <p>
          Some memories live in soft light and silent smiles.
          <br />
          I capture them so years from now,
          <br />
          you’ll remember not just how it looked,
          <br />
          but how it felt.
        </p>

        {/* Notifikasi untuk user TikTok jika tombol tidak merespons */}
        {isTikTok && (
          <p style={{ fontSize: '11px', color: '#ff4d4d', marginBottom: '15px', fontWeight: 'bold' }}>
            *Jika tombol tidak terbuka, klik titik tiga (•••) di pojok kanan atas, lalu pilih "Buka di Browser".
          </p>
        )}

        <div className="buttons">
          {/* WA ADMIN - URL diperbarui agar lebih stabil */}
          <a
            href="https://api.whatsapp.com/send?phone=628211251570"
            target="_blank"
            rel="noopener noreferrer"
            onClick={fireWAEvent}
            className="link-btn"
          >
            WHATSAPP ADMIN
          </a>

          {/* IG WEDDING */}
          <a
            href="https://instagram.com/radeyaphoto"
            target="_blank"
            rel="noopener noreferrer"
            onClick={fireIGWedding}
            className="link-btn"
          >
            INSTAGRAM WEDDING
          </a>

          {/* IG WISUDA */}
          <a
            href="https://instagram.com/radeya.graduation"
            target="_blank"
            rel="noopener noreferrer"
            onClick={fireIGWisuda}
            className="link-btn"
          >
            INSTAGRAM WISUDA
          </a>
        </div>
      </div>

      <Testimonial />

      <div className="mt-12 border-t border-white/5 pt-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Radeyaphoto. All rights reserved.
      </div>
    </div>
  );
}
