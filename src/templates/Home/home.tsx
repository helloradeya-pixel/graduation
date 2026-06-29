import "./Radeyaphoto.css";
import { Testimonial } from "../Testimonial";

export default function RadeyaphotoPage() {
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
            href="https://api.whatsapp.com/send?phone=628211251570&utm_source=tiktok_bio&utm_medium=organic&utm_campaign=landing_page"
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
          >
            WHATSAPP ADMIN
          </a>

          <a
            href="https://instagram.com/radeyaphoto?utm_source=tiktok_bio&utm_medium=organic&utm_campaign=landing_page"
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
          >
            INSTAGRAM WEDDING
          </a>

          <a
            href="https://instagram.com/radeya.graduation?utm_source=tiktok_bio&utm_medium=organic&utm_campaign=landing_page"
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
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
        © {new Date().getFullYear()} Radeyaphoto. All rights reserved.
      </div>
    </div>
  );
}
