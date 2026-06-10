import "./Radeyaphoto.css";
import { Testimonial } from "../Testimonial";

export default function RadeyaphotoPage() {

  const fireWAEvent = () => {
    if (typeof window !== 'undefined') {
      if ((window as any).fbq) {
        (window as any).fbq('track', 'Contact', {
          source: 'bio_page',
        });
      }

      if ((window as any).gtag) {
        (window as any).gtag('event', 'click_whatsapp', {
          event_category: 'bio_page',
          event_label: 'wa_admin',
        });
      }
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

        <div className="buttons">

          {/* WA ADMIN */}
          <a
            href="https://wa.me/628211251570"
            target="_blank"
            onClick={fireWAEvent}
            className="link-btn"
          >
            WHATSAPP ADMIN
          </a>

          {/* IG WEDDING */}
          <a
            href="https://instagram.com/radeyaphoto"
            target="_blank"
            onClick={fireIGWedding}
            className="link-btn"
          >
            INSTAGRAM WEDDING
          </a>

          {/* IG WISUDA */}
          <a
            href="https://instagram.com/radeya.graduation"
            target="_blank"
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
