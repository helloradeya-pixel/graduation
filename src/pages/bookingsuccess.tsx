'use client';

import { useEffect } from 'react';
import { gaTrack } from '@/utils/tracking';

export default function BookingSuccess() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);

    // =========================
    // 1. AMBIL DATA & DEFINISI VARIABEL
    // =========================
    const service = params.get('service') || 'unknown';
    const nama = params.get('nama') || '';
    const email = params.get('email') || '';
    const rawWa = params.get('wa') || '';
    const paket = params.get('package') || '';
    const tanggal = params.get('tanggal') || '';
    const jamMulai = params.get('jam_mulai') || '';
    const jamSelesai = params.get('jam_selesai') || '';
    const pasangan = params.get('pasangan') || '';
    const acara = params.get('acara') || '';
    const lokasi = params.get('lokasi') || '';
    const jam = params.get('jam') || '';
    
    // Hitung value di lingkup yang bisa diakses oleh pesan WhatsApp
    const dpRaw = params.get('dp') || '0';
    const value = Number(dpRaw) < 5000 ? Number(dpRaw) * 1000 : Number(dpRaw);

    // =========================
    // 2. HELPER FUNGSI & HASHING
    // =========================
    const normalizePhone = (phone: string) => {
      let cleaned = phone.replace(/\D/g, ''); 
      return cleaned.startsWith('0') ? '62' + cleaned.substring(1) : cleaned;
    };

    const sha256 = async (message: string) => {
      const msgBuffer = new TextEncoder().encode(message.toLowerCase().trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const getFbc = () => {
      const match = document.cookie.match(/_fbc=([^;]+)/);
      return match ? match[1] : localStorage.getItem('fbc') || undefined;
    };

    // =========================
    // 3. TRACKING (Async)
    // =========================
    const runTracking = async () => {
      const normalizedWA = normalizePhone(rawWa);
      const fbc = getFbc();
      const eventId = `${service}_booking_${Date.now()}`;

      const hashedEmail = await sha256(email);
      const hashedPhone = await sha256(normalizedWA);

      window.fbq?.('track', 'Purchase', {
        value,
        currency: 'IDR',
        content_name: `Booking_${service}`,
        service,
        user_data: { ph: hashedPhone, em: hashedEmail, fbc: fbc }
      }, { eventID: eventId });

      fetch('/api/meta-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service, value, event_id: eventId, type: 'booking',
          user_data: { ph: normalizedWA, em: email, fn: nama, fbc }
        })
      }).catch(console.error);

      gaTrack('purchase', { transaction_id: eventId, value, currency: 'IDR', content_name: `Booking_${service}`, service });
    };

    runTracking();

    // =========================
    // 4. BERSIHKAN URL & REDIRECT WA
    // =========================
    window.history.replaceState({}, document.title, window.location.pathname);

    let message = "";
    if (service === 'couple') {
      message = `Halo kak, saya sudah booking yah atas nama ${nama}.\n\n*Detail Booking:*\nPasangan: ${pasangan}\nAcara: ${acara}\nTanggal: ${tanggal}\nJam: ${jam}\nLokasi: ${lokasi}\nPaket: ${paket}\nDP: Rp${value.toLocaleString('id-ID')}`;
    } else {
      message = `Halo kak, saya sudah booking ${service} atas nama ${nama}.\n\n*Detail Booking:*\nPackage: ${paket}\nTanggal: ${tanggal}\nJam: ${jamMulai} - ${jamSelesai}\nDP: Rp${value.toLocaleString('id-ID')}`;
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
