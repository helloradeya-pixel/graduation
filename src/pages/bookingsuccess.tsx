'use client';

import { useEffect } from 'react';

export default function BookingSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // =========================
    // DATA INPUT
    // =========================
    const service = params.get('service') || 'unknown';
    const nama = params.get('nama') || '';
    const paket = params.get('package') || '';
    const tanggal = params.get('tanggal') || '';
    const jamMulai = params.get('jam_mulai') || '';
    const jamSelesai = params.get('jam_selesai') || '';
    const dp = params.get('dp') || '0';
    const value = Number(dp);

    // =========================
    // UNIQUE EVENT ID (Kunci Deduplikasi)
    // =========================
    // Dibuat sekali di sini agar sama antara Pixel dan CAPI
    const eventId = `${service}_booking_${Date.now()}`;

    // =========================
    // META PIXEL (Browser)
    // =========================
    const fireMetaEvent = () => {
      // Kita gunakan event 'Purchase' standar Meta
      window.fbq?.('track', 'Purchase', {
        value,
        currency: 'IDR',
        content_name: `Booking_${service}`,
        service,
      }, { eventID: eventId });
      
      console.log('PIXEL FIRED (Purchase):', { eventId, service, value });
    };

    // =========================
    // CAPI (Server-side)
    // =========================
    const fireCAPI = async () => {
      try {
        await fetch('/api/meta-capi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service,
            value,
            event_id: eventId,
            type: 'booking', // <--- Pemicu agar Meta mencatatnya sebagai 'Purchase'
          }),
        });
      } catch (err) {
        console.log('CAPI ERROR:', err);
      }
    };

    // =========================
    // EXECUTION
    // =========================
    fireMetaEvent();
    fireCAPI();

    // WHATSAPP REDIRECT
    const message = service === 'graduation' 
      ? `Halo kak, sudah booking Graduation atas nama ${nama}\nPackage: ${paket}\nTanggal: ${tanggal}\nJam: ${jamMulai} - ${jamSelesai}\nDP: ${dp}`
      : `Halo kak, sudah booking ${service} atas nama ${nama}\nDP: ${dp}`;

    const waLink = `https://wa.me/628211251570?text=${encodeURIComponent(message)}`;

    const timer = setTimeout(() => {
      window.location.href = waLink;
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Booking Berhasil</h1>
        <p className="mt-2 text-neutral-400">Sedang menghubungkan ke WhatsApp...</p>
      </div>
    </div>
  );
}
