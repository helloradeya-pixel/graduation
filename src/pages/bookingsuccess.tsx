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
    // META PIXEL
    // =========================

    window.fbq?.('track', 'Lead', {
      content_name: 'Booking Success',
      service,
    });

    window.fbq?.('track', 'Purchase', {
      value,
      currency: 'IDR',
      service,
    });

    if (service === 'graduation') {
      window.fbq?.('trackCustom', 'BookingGraduation');
    }

    if (service === 'couple') {
      window.fbq?.('trackCustom', 'BookingCouple');
    }

    // =========================
    // GA4 TRACKING
    // =========================

    window.gtag?.('event', 'generate_lead', {
      event_category: 'booking',
      event_label: service,
    });

    window.gtag?.('event', 'purchase', {
      value,
      currency: 'IDR',
      item_category: service,
    });

    // =========================
    // WHATSAPP MESSAGE
    // =========================

    let message = '';

    if (service === 'graduation') {
      message =
`Halo kak, sudah booking atas nama ${nama}
Package: ${paket}
Tanggal: ${tanggal}
Jam: ${jamMulai} - ${jamSelesai}
( DP ): ${dp}`;
    }

    if (service === 'couple') {
      message =
`Halo kak, sudah booking atas nama ${nama} yah kak!
( DP ): ${dp}`;
    }

    // =========================
    // REDIRECT WHATSAPP
    // =========================

    setTimeout(() => {
      window.location.href =
        `https://wa.me/628211251570?text=${encodeURIComponent(message)}`;
    }, 1500);
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
