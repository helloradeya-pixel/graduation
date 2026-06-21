'use client';

import { useEffect } from 'react';

export default function BookingSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // =========================
    // DATA INPUT & NORMALISASI
    // =========================
    const service = params.get('service') || 'unknown';
    const nama = params.get('nama') || '';
    const rawWa = params.get('wa') || '';
    const paket = params.get('package') || '';
    const tanggal = params.get('tanggal') || '';
    const jamMulai = params.get('jam_mulai') || '';
    const jamSelesai = params.get('jam_selesai') || '';
    
    // Fungsi normalisasi WA ke format 62xxx (E.164) agar Match Quality bagus
    const normalizePhone = (phone: string) => {
      let cleaned = phone.replace(/\D/g, ''); 
      if (cleaned.startsWith('0')) {
        return '62' + cleaned.substring(1);
      }
      return cleaned;
    };
    const normalizedWA = normalizePhone(rawWa);

    // Logika Koreksi Harga
    const dpRaw = params.get('dp') || '0';
    const rawValue = Number(dpRaw);
    const value = rawValue < 5000 ? rawValue * 1000 : rawValue;

    // =========================
    // UNIQUE EVENT ID (Deduplikasi)
    // =========================
    const eventId = `${service}_booking_${Date.now()}`;

    // =========================
    // META PIXEL (Browser)
    // =========================
    const fireMetaEvent = () => {
      window.fbq?.('track', 'Purchase', {
        value,
        currency: 'IDR',
        content_name: `Booking_${service}`,
        service,
        user_data: {
          ph: normalizedWA 
        }
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
            type: 'booking',
            user_data: { ph: normalizedWA }
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
      ? `Halo kak, saya ${nama} sudah booking Graduation\nPackage: ${paket}\nTanggal: ${tanggal}\nJam: ${jamMulai} - ${jamSelesai}\nDP: Rp${value.toLocaleString('id-ID')}`
      : `Halo kak, saya ${nama} sudah booking ${service}\nDP: Rp${value.toLocaleString('id-ID')}`;

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
