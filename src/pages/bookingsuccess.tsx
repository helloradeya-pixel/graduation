'use client';

import { useEffect } from 'react';
import { gaTrack } from '@/utils/tracking';

export default function BookingSuccess() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);

    // =========================
    // 1. AMBIL DATA
    // =========================
    const service = params.get('service') || 'unknown';
    const nama = params.get('nama') || '';
    const email = params.get('email') || '';
    const rawWa = params.get('wa') || '';
    
    // Data tambahan untuk Couple & Umum
    const paket = params.get('package') || '';
    const tanggal = params.get('tanggal') || '';
    const jamMulai = params.get('jam_mulai') || '';
    const jamSelesai = params.get('jam_selesai') || '';
    const pasangan = params.get('pasangan') || '';
    const acara = params.get('acara') || '';
    const lokasi = params.get('lokasi') || '';
    const jam = params.get('jam') || '';

    // =========================
    // 2. HELPER FUNGSI
    // =========================
    const normalizePhone = (phone: string) => {
      let cleaned = phone.replace(/\D/g, ''); 
      return cleaned.startsWith('0') ? '62' + cleaned.substring(1) : cleaned;
    };

    const getFbc = () => {
      const match = document.cookie.match(/_fbc=([^;]+)/);
      return match ? match[1] : localStorage.getItem('fbc') || undefined;
    };

    const normalizedWA = normalizePhone(rawWa);
    const fbc = getFbc();
    const eventId = `${service}_booking_${Date.now()}`;
    
    const dpRaw = params.get('dp') || '0';
    const value = Number(dpRaw) < 5000 ? Number(dpRaw) * 1000 : Number(dpRaw);

    // =========================
    // 3. META PIXEL (Browser)
    // =========================
    window.fbq?.('track', 'Purchase', {
      value,
      currency: 'IDR',
      content_name: `Booking_${service}`,
      service,
      user_data: { 
        ph: normalizedWA,
        em: email,
        fbc: fbc 
      }
    }, { eventID: eventId });

    // =========================
    // 4. CAPI (Server-side)
    // =========================
    fetch('/api/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service,
        value,
        event_id: eventId,
        type: 'booking',
        user_data: { 
          ph: normalizedWA,
          em: email,
          fn: nama,
          fbc: fbc
        }
      }),
    }).catch(err => console.log('CAPI ERROR:', err));

    // =========================
    // 5. GA4 TRACKING
    // =========================
    gaTrack('purchase', {
      transaction_id: eventId,
      value,
      currency: 'IDR',
      content_name: `Booking_${service}`,
      service,
    });

    // =========================
    // 6. WHATSAPP REDIRECT DINAMIS
    // =========================
    let message = "";
    if (service === 'couple') {
      message = `Halo kak, saya ${nama} sudah booking.\n\n*Detail Booking:*\nPasangan: ${pasangan}\nAcara: ${acara}\nTanggal: ${tanggal}\nJam: ${jam}\nLokasi: ${lokasi}\nPaket: ${paket}\nDP: Rp${value.toLocaleString('id-ID')}`;
    } else {
      message = `Halo kak, saya ${nama} sudah booking ${service}\nPackage: ${paket}\nTanggal: ${tanggal}\nJam: ${jamMulai} - ${jamSelesai}\nDP: Rp${value.toLocaleString('id-ID')}`;
    }

    const waLink = `https://wa.me/628211251570?text=${encodeURIComponent(message)}`;

    const timer = setTimeout(() => { window.location.href = waLink; }, 3000);
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
