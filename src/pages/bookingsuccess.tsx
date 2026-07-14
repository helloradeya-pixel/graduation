'use client';

import { useEffect } from 'react';
import Head from 'next/head';
import { gaTrack } from '@/utils/tracking';

export default function BookingSuccess() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);

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
    
    // PERBAIKAN: Logika perhitungan value yang lebih aman
    const dpRaw = params.get('dp') || '0';
    const dpClean = Number(dpRaw.replace(/[^0-9]/g, ''));
    const value = dpClean < 10000 ? dpClean * 1000 : dpClean;

    // Fungsi Helper
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

    const runTracking = async () => {
      const normalizedWA = normalizePhone(rawWa);
      const fbc = getCookie('_fbc') || localStorage.getItem('fbc');
      const fbp = getCookie('_fbp');
      const eventId = `${service}_booking_${Date.now()}`;
      
      const namaParts = nama.split(' ');
      const fn = namaParts[0];
      const ln = namaParts.slice(1).join(' ');

      const hashedEmail = await sha256(email);
      const hashedPhone = await sha256(normalizedWA);

      // 1. Browser Tracking
      const fbq = (window as any).fbq;
      if (typeof fbq === 'function') {
        fbq('track', 'Purchase', {
          value,
          currency: 'IDR',
          content_name: `Booking_${service}`,
          content_category: service,
          user_data: { ph: hashedPhone, em: hashedEmail, fbc: fbc, fbp: fbp }
        }, { eventID: eventId });
      }

      // 2. Server Tracking (CAPI) - PERBAIKAN: Mengirim segment agar backend benar memilih Pixel ID
      fetch('/api/meta-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service, 
          segment: service, // Penting agar backend tahu ini graduation/couple/frame
          value, 
          event_id: eventId, 
          type: 'booking',
          url: window.location.href,
          user_data: { ph: normalizedWA, em: email, fn, ln, fbc, fbp }
        })
      }).catch(console.error);

      gaTrack('purchase', { transaction_id: eventId, value, currency: 'IDR', content_name: `Booking_${service}`, service });
    };

    runTracking();
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
      <Head>
        <title>Form Booking | Radeya Photography</title>
      </Head>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Booking Berhasil</h1>
        <p className="mt-2 text-neutral-400">Sedang menghubungkan ke WhatsApp...</p>
      </div>
    </div>
  );
}
