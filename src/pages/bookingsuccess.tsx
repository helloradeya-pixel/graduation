import { useEffect } from 'react';

export default function BookingSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const service = params.get('service');
    const nama = params.get('nama') || '';
    const paket = params.get('package') || '';
    const tanggal = params.get('tanggal') || '';
    const jamMulai = params.get('jam_mulai') || '';
    const jamSelesai = params.get('jam_selesai') || '';
    const dp = params.get('dp') || '';

    const value = Number(dp || 0);

    // =========================
    // META PIXEL - BOOKING EVENTS (SPLIT CLEAN)
    // =========================

    const fireMetaEvent = () => {
      if (service === 'graduation') {
        window.fbq?.('trackCustom', 'CompleteRegistration_Graduation', {
          service: 'graduation',
          value,
          currency: 'IDR',
        });
      }

      if (service === 'couple') {
        window.fbq?.('trackCustom', 'CompleteRegistration_Couple', {
          service: 'couple',
          value,
          currency: 'IDR',
        });
      }

      // fallback safety
      if (!service) {
        window.fbq?.('trackCustom', 'CompleteRegistration', {
          value,
          currency: 'IDR',
        });
      }

      console.log('META EVENT FIRED:', {
        service,
        value,
      });
    };

    // =========================
    // GA4 EVENT
    // =========================

    const fireGA4 = () => {
      window.gtag?.('event', 'generate_lead', {
        event_category: 'booking',
        event_label: service,
        value,
      });
    };

    // =========================
    // WHATSAPP MESSAGE
    // =========================

    let message = '';

    if (service === 'graduation') {
      message = `Halo kak, sudah booking Graduation atas nama ${nama}
Package: ${paket}
Tanggal: ${tanggal}
Jam: ${jamMulai} - ${jamSelesai}
DP: ${dp}`;
    }

    if (service === 'couple') {
      message = `Halo kak, sudah booking Couple atas nama ${nama}
DP: ${dp}`;
    }

    const waLink = `https://wa.me/628211251570?text=${encodeURIComponent(message)}`;

    // =========================
    // EXECUTION ORDER (IMPORTANT)
    // =========================

    fireMetaEvent();
    fireGA4();

    // kasih waktu pixel terkirim sebelum redirect
    const timer = setTimeout(() => {
      window.location.href = waLink;
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1>Booking Berhasil</h1>
        <p>Sedang menghubungkan ke WhatsApp...</p>
      </div>
    </div>
  );
}
