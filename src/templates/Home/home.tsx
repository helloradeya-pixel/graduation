import Head from 'next/head';
import { AppConfig } from '../utils/AppConfig'; // Import AppConfig
import "./Radeyaphoto.css";
import { Testimonial } from "../Testimonial";

export default function RadeyaphotoPage() {
  
  const trackClick = (namaTombol: string) => {
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'click_button', {
        'event_category': 'Link Bio',
        'event_label': namaTombol
      });
    }
  };

  return (
    <div className="radeyaphoto">
      <Head>
        <title>{AppConfig.title}</title>
        <meta name="description" content={AppConfig.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="hero"></div>

      <div className="profile-section">
        <img
          src="/assets/images/profile.jpg"
          alt="profile"
          className="profile-img"
        />

        <h1>{AppConfig.site_name}</h1>

        <p style={{ marginBottom: '30px' }}>
          Some memories live in soft light and silent smiles.
          <br />
          I capture them so years from now,
          <br />
          you’ll remember not just how it looked,
          <br />
          but how it felt.
        </p>

        <div className="buttons">
          <a 
            href="/frame-kenangan" 
            className="link-btn"
            onClick={() => trackClick('Pesan Frame Kenangan')}
          >
            FRAME KENANGAN
          </a>

          <a
            href="https://api.whatsapp.com/send?phone=628211251570&text=Halo%20admin,%20aku%20mau%20tanya-tanya%20boleh%20yah.&utm_source=tiktok_bio&utm_medium=organic&utm_campaign=landing_page"
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
            onClick={() => trackClick('WhatsApp Admin')}
          >
            WHATSAPP ADMIN
          </a>

          <a
            href="https://instagram.com/radeyaphoto?utm_source=tiktok_bio&utm_medium=organic&utm_campaign=landing_page"
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
            onClick={() => trackClick('Instagram Wedding')}
          >
            INSTAGRAM WEDDING
          </a>

          <a
            href="https://instagram.com/radeya.graduation?utm_source=tiktok_bio&utm_medium=organic&utm_campaign=landing_page"
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
            onClick={() => trackClick('Instagram Wisuda')}
          >
            INSTAGRAM WISUDA
          </a>
        </div>

        <div className="instruction-box" style={{ 
          marginTop: '40px',
          padding: '15px', 
          background: '#f1f1f1', 
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#666'
        }}>
          <p>
            <strong>Tips:</strong> Jika tombol di atas tidak merespons, klik titik tiga (•••) di pojok kanan atas layar Anda, lalu pilih <strong>"Buka di Browser"</strong>.
          </p>
        </div>
      </div>

      <Testimonial />

      <div className="mt-12 border-t border-white/5 pt-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} {AppConfig.site_name}. All rights reserved.
      </div>
    </div>
  );
}
