'use client';
import { useState } from 'react';
import Head from 'next/head';

export default function FrameKenanganPage() {
  const PIXEL_ID = '1413881487242621'; 

  const [data, setData] = useState({ 
    namaTitel: '', jurusan: '', universitas: '', kota: '', tglWisuda: '', alamat: '', 
    wa: '', email: '', opsiTambahan: 'Tanpa Selempang/Medali' 
  });
  const [selectedPaket, setSelectedPaket] = useState<any>(null);
  const [buktiUrl, setBuktiUrl] = useState('');

  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return undefined;
    return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
  };

  const paket = [
    { id: 1, nama: 'Frame Only', harga: '150.000', desc: 'Frame Akrilik Premium 30x40 cm', img: '/assets/images/frame-only.png' },
    { id: 2, nama: 'Frame + Custom Design', harga: '200.000', desc: 'Frame 30x40 cm, Desain Nama & Jurusan, Free 1x Revisi', img: '/assets/images/frame-custom.png' },
    { id: 3, nama: 'Full Service', harga: '250.000', desc: 'Frame Akrilik Premium 30x40 cm, Desain Nama & Jurusan, Cetak 9 Foto, Free Layout & 1x Revisi', img: '/assets/images/full-service.png' }
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'preset_radeyaframe');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/zj5bpv8i/image/upload', {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      setBuktiUrl(json.secure_url);
      alert('Bukti transfer berhasil diunggah!');
    } catch (err) { alert('Gagal unggah foto.'); }
  };

  const handleCheckout = async () => {
    if (!selectedPaket || !buktiUrl) return alert('Pilih paket dan unggah bukti transfer!');
    if (!data.wa || !data.email) return alert('Mohon isi nomor WhatsApp dan Email Anda.');
    
    const eventId = `booking_${Date.now()}`;
    const namaParts = data.namaTitel.split(' ');
    
    // 1. Browser Pixel Tracking
    const fbq = (window as any).fbq;
    if (typeof fbq === 'function') {
      const hargaBersih = parseFloat(selectedPaket.harga.replace(/\./g, ''));
      fbq('track', 'Purchase', { 
        value: hargaBersih, currency: 'IDR', content_name: selectedPaket.nama
      }, { eventID: eventId });
    }

    // 2. Server-Side Tracking (CAPI)
    try {
      await fetch('/api/meta-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: selectedPaket.nama,
          segment: 'frame',
          value: selectedPaket.harga.replace(/\./g, ''),
          type: 'booking',
          event_id: eventId,
          url: window.location.href,
          user_data: { 
            ph: data.wa, 
            em: data.email,
            fn: namaParts[0],
            ln: namaParts.slice(1).join(' '),
            fbc: getCookie('_fbc'),
            fbp: getCookie('_fbp')
          }
        })
      });
    } catch (e) { console.error("CAPI failed", e); }

    // 3. Notion Integration
    await fetch('/api/send-frame-kenangan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, paket: selectedPaket, buktiUrl })
    });
    
    const pesan = `*ORDER BARU - FRAME KENANGAN*\n------------------------------------\n*PAKET PILIHAN:* ${selectedPaket.nama} (IDR ${selectedPaket.harga})\n\n*DATA DESAIN:*\n• Nama & Titel : ${data.namaTitel}\n• Universitas  : ${data.universitas}\n• Jurusan      : ${data.jurusan}\n• Kota Wisuda  : ${data.kota}\n• Tgl Wisuda   : ${data.tglWisuda}\n\n*DATA PENGIRIMAN:*\n• WhatsApp     : ${data.wa}\n• Alamat       : ${data.alamat}\n\n*BUKTI TRANSFER:*\n${buktiUrl}`;

    window.location.href = `https://wa.me/628211251570?text=${encodeURIComponent(pesan)}`;
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <Head>
        <title>Pemesanan Resmi | Radeya Photography</title>
        <script dangerouslySetInnerHTML={{ __html: `
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
          (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}} />
      </Head>

      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Pilih Paket Layanan</h1>
      
      <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
        {paket.map((p) => (
          <div key={p.id}>
            <div onClick={() => setSelectedPaket(p)} style={{ 
                border: selectedPaket?.id === p.id ? '2px solid #000' : '1px solid #ddd',
                padding: '20px', borderRadius: '12px', cursor: 'pointer', background: '#fff',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
              <img src={p.img} alt={p.nama} style={{ width: '100%', maxWidth: '300px', borderRadius: '6px', display: 'block' }} />
              <div style={{ fontWeight: 'bold', marginTop: '15px', textAlign: 'center' }}>{p.nama} - IDR {p.harga}</div>
              <ul style={{ fontSize: '0.9em', color: '#666', textAlign: 'center', padding: 0, marginTop: '10px', width: '100%', listStyleType: 'none' }}>
                {p.desc.split(', ').map((item, index) => (<li key={index} style={{ marginBottom: '5px' }}>{item}</li>))}
              </ul>
            </div>

            {selectedPaket?.id === p.id && (
              <div style={{ background: '#fdfdfd', padding: '20px', borderRadius: '12px', border: '1px solid #000', marginTop: '10px' }}>
                <h3>Formulir Pemesanan</h3>
                <input placeholder="Nama Lengkap & Titel" onChange={(e) => setData({...data, namaTitel: e.target.value})} style={inputStyle} />
                <input placeholder="No. WhatsApp (Wajib)" onChange={(e) => setData({...data, wa: e.target.value})} style={inputStyle} />
                <input type="email" placeholder="Alamat Email (Wajib)" onChange={(e) => setData({...data, email: e.target.value})} style={inputStyle} />
                <input placeholder="Universitas" onChange={(e) => setData({...data, universitas: e.target.value})} style={inputStyle} />
                <input placeholder="Jurusan" onChange={(e) => setData({...data, jurusan: e.target.value})} style={inputStyle} />
                <input placeholder="Kota Wisuda" onChange={(e) => setData({...data, kota: e.target.value})} style={inputStyle} />
                <input placeholder="Tanggal Wisuda" onChange={(e) => setData({...data, tglWisuda: e.target.value})} style={inputStyle} />
                <select onChange={(e) => setData({...data, opsiTambahan: e.target.value})} style={{...inputStyle, marginBottom: '15px'}}>
                  <option value="Tanpa Selempang/Medali">Tanpa Selempang/Medali</option>
                  <option value="Kirimkan atribut ke kami">Kirimkan atribut ke kami</option>
                  <option value="Pasang sendiri">Pasang sendiri</option>
                </select>
                <textarea placeholder="Alamat Lengkap" onChange={(e) => setData({...data, alamat: e.target.value})} style={inputStyle} />
                <label>Unggah Bukti Transfer:</label>
                <input type="file" onChange={handleImageUpload} style={{ display: 'block', marginBottom: '15px' }} />
                <button onClick={handleCheckout} style={btnStyle}>Konfirmasi Pemesanan</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' };
const btnStyle: React.CSSProperties = { width: '100%', padding: '16px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
