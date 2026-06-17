import { useEffect, useState } from 'react';
import { Base } from '../templates/Base';
import { trackGraduationView } from '@/utils/tracking';

export default function Graduation() {
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    trackGraduationView();

    const promoActive = true;
    const oneTimeOnly = true;
    const alreadyClosed = localStorage.getItem("promoClosed");

    if (!promoActive) return;

    if (oneTimeOnly && alreadyClosed) return;

    const timer = setTimeout(() => {
      setShowPromo(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const closePopup = () => {
    setShowPromo(false);
    localStorage.setItem("promoClosed", "yes");
  };

  return (
    <>
      <Base />

      {/* POPUP PROMO */}
      {showPromo && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div style={{
            background: "#fff",
            width: "100%",
            maxWidth: "360px",
            borderRadius: "14px",
            padding: "20px",
            textAlign: "center",
            position: "relative",
            fontFamily: "Arial"
          }}>

            {/* CLOSE */}
            <div
              onClick={closePopup}
              style={{
                position: "absolute",
                top: 10,
                right: 12,
                fontSize: 18,
                cursor: "pointer"
              }}
            >
              ✕
            </div>

            {/* CONTENT */}
            <h2>🎓 Promo Wisuda Radeya</h2>

            <p>
              Paket dokumentasi wisuda mulai <b>Rp375.000</b>
            </p>

            <p>
              Khusus <b>5 slot selama bulan Juni</b>
            </p>

            <p style={{ fontSize: "13px", color: "#555" }}>
              Hasil foto estetik & natural + arahan pose
            </p>

            {/* CTA WA */}
            <a
              href="https://wa.me/628211251570?text=Halo%20kak%20saya%20mau%20booking%20promo%20wisuda%20Rp375.000"
              style={{
                display: "block",
                background: "#25D366",
                color: "#fff",
                padding: "12px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "bold",
                marginTop: "10px"
              }}
            >
              Chat WhatsApp Sekarang
            </a>

            {/* CLOSE TEXT */}
            <p
              onClick={closePopup}
              style={{
                marginTop: "10px",
                fontSize: "12px",
                cursor: "pointer",
                color: "#777"
              }}
            >
              Tutup
            </p>

          </div>
        </div>
      )}
    </>
  );
}
