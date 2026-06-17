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
          background: "rgba(0,0,0,0.65)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          padding: "20px",
          backdropFilter: "blur(6px)"
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
            fontFamily: "Arial"
          }}>

            {/* CLOSE */}
            <div
              onClick={closePopup}
              style={{
                position: "absolute",
                top: 12,
                right: 14,
                fontSize: 18,
                cursor: "pointer",
                color: "#888"
              }}
            >
              ✕
            </div>

            {/* BADGE */}
            <div style={{
              display: "inline-block",
              background: "#111",
              color: "#fff",
              fontSize: "12px",
              padding: "4px 10px",
              borderRadius: "20px",
              marginBottom: "10px"
            }}>
              LIMITED OFFER
            </div>

            {/* TITLE */}
            <h2 style={{
              fontSize: "20px",
              marginBottom: "10px",
              fontWeight: 700
            }}>
              🎓 Promo Wisuda Radeya
            </h2>

            {/* PRICE */}
            <p style={{
              fontSize: "15px",
              marginBottom: "8px",
              color: "#333"
            }}>
              Paket mulai <b style={{ fontSize: "18px" }}>Rp375.000</b>
            </p>

            {/* SLOT */}
            <p style={{
              fontSize: "13px",
              color: "#666",
              marginBottom: "12px"
            }}>
              Khusus <b>5 slot selama bulan Juni</b>
            </p>

            {/* DESC */}
            <p style={{
              fontSize: "13px",
              color: "#777",
              lineHeight: "1.4",
              marginBottom: "18px"
            }}>
              Hasil foto estetik & natural<br />
              + arahan pose profesional
            </p>

            {/* CTA */}
            <a
              href="https://wa.me/628211251570?text=Halo%20kak%20saya%20mau%20booking%20promo%20wisuda%20Rp375.000"
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

            {/* CLOSE TEXT */}
            <p
              onClick={closePopup}
              style={{
                marginTop: "12px",
                fontSize: "12px",
                cursor: "pointer",
                color: "#888"
              }}
            >
              Nanti saja
            </p>

          </div>
        </div>
      )}
    </>
  );
}
