'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head'; // Head ditambahkan
import { Base } from '../templates/Base';
import { trackGraduationView } from '@/utils/tracking';

export default function Graduation() {
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    trackGraduationView();

    // 1. Menangkap FBC dari URL (parameter 'fbclid') dan simpan di localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    if (fbclid) {
      // Format standar Meta untuk FBC
      localStorage.setItem('fbc', `fb.1.${Date.now()}.${fbclid}`);
    }

    const promoActive = false; // Ubah ke true jika ingin mengaktifkan
    const oneTimeOnly = true;
    const alreadyClosed = localStorage.getItem("promoClosed");

    if (!promoActive) return;
    if (oneTimeOnly && alreadyClosed) return;

    const timer = setTimeout(() => {
      setShowPromo(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // 2. Fungsi Tracking saat klik WhatsApp (mengirim data ke API CAPI Anda)
  const handleWhatsAppClick = () => {
    const fbc = localStorage.getItem('fbc') || undefined;

    fetch('/api/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'booking', // Memicu event 'Purchase' di API
        service: 'graduation_promo',
        value: 375, // API Anda akan mengalikan < 5000 dengan 1000 jadi 375.000
        user_data: {
          fbc: fbc // Penting untuk atribusi iklan
        }
      })
    }).catch(err => console.error("CAPI Tracking Error:", err));
  };

  const closePopup = () => {
    setShowPromo(false);
    localStorage.setItem("promoClosed", "yes");
  };

  return (
    <>
      <Head>
        <title>Fotografi Wisuda | Radeyaphoto</title>
        <meta name="description" content="Jasa fotografi wisuda estetik & natural dengan arahan pose profesional oleh Radeyaphoto." />
      </Head>

      <Base />

      {/* SOFT POPUP */}
      {showPromo && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div style={{
            background: "linear-gradient(145deg, #ffffff, #f7f7f7)",
            width: "100%",
            maxWidth: "380px",
            borderRadius: "18px",
            padding: "22px",
            textAlign: "center",
            position: "relative",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            border: "1px solid rgba(0,0,0,0.05)",
            fontFamily: "Arial",
            transform: "translateY(-10px)",
            animation: "fadeIn 0.25s ease-in-out"
          }}>
            <div onClick={closePopup} style={{ position: "absolute", top: 12, right: 14, fontSize: 18, cursor: "pointer", color: "#888" }}>✕</div>
            
            <div style={{ display: "inline-block", background: "#111", color: "#fff", fontSize: "12px", padding: "4px 10px", borderRadius: "20px", marginBottom: "10px" }}>LIMITED OFFER</div>
            
            <h2 style={{ fontSize: "20px", marginBottom: "10px", fontWeight: 700 }}>🎓 Promo Wisuda Radeya</h2>
            
            <p style={{ fontSize: "15px", marginBottom: "8px", color: "#333" }}>Paket mulai <b style={{ fontSize: "18px" }}>Rp375.000</b></p>
            
            <p style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>Khusus <b>5 slot selama bulan Juni</b></p>
            
            <p style={{ fontSize: "13px", color: "#777", lineHeight: "1.4", marginBottom: "18px" }}>Hasil foto estetik & natural<br />+ arahan pose profesional</p>

            <a
              href="https://wa.me/628211251570?text=Halo%20kak%20saya%20mau%20booking%20promo%20wisuda%20Rp375.000"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick} // Tracking dipicu saat klik
              style={{
                display: "block",
                background: "linear-gradient(90deg, #25D366, #20b858)",
                color: "#fff",
                padding: "14px",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "14px",
                boxShadow: "0 10px 20px rgba(37, 211, 102, 0.25)"
              }}
            >
              Chat & Booking Sekarang
            </a>

            <p onClick={closePopup} style={{ marginTop: "12px", fontSize: "12px", cursor: "pointer", color: "#888" }}>Nanti saja</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}
