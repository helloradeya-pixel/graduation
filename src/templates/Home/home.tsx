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

        {/* Kotak Instruksi Edukasi */}
        <div className="instruction-box" style={{ 
          background: '#f8f8f8', 
          padding: '20px', 
          borderRadius: '12px', 
          margin: '20px auto',
          maxWidth: '400px',
          border: '1px solid #ddd',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>Tips Akses Cepat</h3>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.5' }}>
            TikTok membatasi akses langsung ke aplikasi lain. Agar tombol berfungsi normal, silakan ikuti langkah ini:
          </p>
          <ul style={{ fontSize: '14px', color: '#333', textAlign: 'left', paddingLeft: '20px', marginTop: '10px' }}>
            <li>Klik titik <strong>tiga (•••)</strong> di pojok kanan atas.</li>
            <li>Pilih <strong>"Buka di Browser"</strong> (Open in Browser).</li>
          </ul>
        </div>

        <p style={{ marginBottom: '20px' }}>
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
            href="https://api.whatsapp.com/send?phone=628211251570"
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
          >
            WHATSAPP ADMIN
          </a>

          <a
            href="https://instagram.com/radeyaphoto"
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
          >
            INSTAGRAM WEDDING
          </a>

          <a
            href="https://instagram.com/radeya.graduation"
            target="_blank"
            rel="noopener noreferrer"
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
