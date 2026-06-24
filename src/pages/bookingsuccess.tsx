'use client';

import { useEffect } from 'react';
import { gaTrack } from '@/utils/tracking';

export default function BookingSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // =========================
    // HELPER: GET FBC COOKIE
    // =========================
    const getFbc = () => {
      const match = document.cookie.match(/_fbc=([^;]+)/);
      return match ? match[1] : undefined;
    };

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
    
    const normalizePhone = (phone: string) => {
      let cleaned = phone.replace(/\D/g, ''); 
      if (cleaned.startsWith('0')) {
        return '62' + cleaned.substring(1);
      }
      return cleaned;
    };
    const normalizedWA = normalizePhone(rawWa);
    const fbc = getFbc(); // Ambil FBC

    const dpRaw = params.get('dp') || '0';
    const rawValue = Number(dpRaw);
    const value = rawValue < 5000 ? rawValue * 1000 : rawValue;

    // =========================
    // UNIQUE EVENT ID
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
          ph: normalizedWA,
          fbc: fbc 
        }
      }, { eventID: eventId });
      
      console.log('PIXEL FIRED (Purchase):', { eventId, service, value, fbc });
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
            user_data: { 
              ph: normalizedWA,
              fbc: fbc // Kirim FBC ke CAPI
            }
          }),
        });
      } catch (err) {
        console.log('CAPI ERROR:', err);
      }
    };

    // =========================
    // GA4 TRACKING
    // =========================
    const fireGA4 = () => {
      gaTrack('purchase', {
        transaction_id: eventId,
        value,
        currency: 'IDR',
        content_name: `Booking_${service}`,
        service,
      });
    };

    // =========================
    // EXECUTION
    // =========================
    fireMetaEvent();
    fireCAPI();
    fireGA4();

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
