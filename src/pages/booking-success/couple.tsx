'use client';

import { useEffect } from 'react';
import Head from 'next/head';
import { gaTrack } from '@/utils/tracking';

export default function BookingSuccessCouple() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);

    const service = 'couple';
    const nama = params.get('nama') || '';
    const email = params.get('email') || '';
    const rawWa = params.get('wa') || '';
    const paket = params.get('package') || '';
    const tanggal = params.get('tanggal') || '';
    const pasangan = params.get('pasangan') || '';
    const acara = params.get('acara') || '';
    const lokasi = params.get('lokasi') || '';
    const jam = params.get('jam') || '';
    
    const dpRaw = params.get('dp') || '0';
    const dpClean = Number(dpRaw.replace(/[^0-9]/g, ''));
    const value = dpClean < 10000 ? dpClean * 1000 : dpClean;

    const normalizePhone = (phone: string) => {
      let cleaned = phone.replace(/\D/g, ''); 
      return cleaned.startsWith('0') ? '62' + cleaned.substring(1) : cleaned;
    };

    const getCookie = (name: string) => {
      return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
    };

    const sha256 = async (message: string) => {
      const msgBuffer = new TextEncoder().encode(message.toLowerCase().trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    let message = `Halo kak, saya sudah booking couple yah atas nama ${nama}.\n\n*Detail Booking:*\nPasangan: ${pasangan}\nAcara: ${acara}\nTanggal: ${tanggal}\nJam: ${jam}\nLokasi: ${lokasi}\nPaket: ${paket}\nDP: Rp${value.toLocaleString('id-ID')}`;
    const waLink = `https://wa.me/628211251570?text=${encodeURIComponent(message)}`;

    const runTracking = async () => {
      const normalizedWA = normalizePhone(rawWa);
      const fbc = getCookie('_fbc') || localStorage.getItem('fbc');
      const fbp = getCookie('_fbp') || localStorage.getItem('fbp');
      const eventId = `couple_booking_${Date.now()}`;
      
      const namaParts = nama.split(' ');
      const fn = namaParts[0];
      const ln = namaParts.slice(1).join(' ');
      const segment = 'couple';

      const [hashedEmail, hashedPhone] = await Promise.all([sha256(email), sha256(normalizedWA)]);

      const browserPromise = new Promise((resolve) => {
        const fbq = (window as any).fbq;
        if (typeof fbq === 'function') {
          fbq('track', 'Purchase', {
            value, currency: 'IDR', content_name: `Booking_${service}`,
            user_data: { ph: hashedPhone, em: hashedEmail, ...(fbc && { fbc }), ...(fbp && { fbp }) }
          }, { eventID: eventId });
          resolve(true);
        } else {
          resolve(false);
        }
      });

      const serverPromise = fetch('/api/meta-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service, segment, value, event_id: eventId, type: 'booking',
          url: window.location.href,
          user_data: { ph: normalizedWA, em: email, fn, ln, ...(fbc && { fbc }), ...(fbp && { fbp }) }
        })
      });

      await Promise.all([browserPromise, serverPromise]);
      gaTrack('purchase', { 
        transaction_id: eventId, 
        value, 
        currency: 'IDR', 
        content_name: `Booking_${service}`, 
        service: service, 
        segment: segment 
      });
    };

    runTracking().then(() => {
      // Beri jeda 1 detik (1000 ms) agar data GA4 & Meta Pixel terkirim sempurna
      setTimeout(() => {
        window.location.href = waLink;
      }, 1500);
    });

    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <Head>
        <title>Booking Couple Berhasil | Radeya Photography</title>
      </Head>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Booking Couple Berhasil</h1>
        <p className="mt-2 text-neutral-400">Sedang menghubungkan ke WhatsApp...</p>
      </div>
    </div>
  );
}
