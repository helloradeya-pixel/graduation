import { useState, ChangeEvent } from 'react';
import Head from 'next/head';

export default function FrameKenanganPage() {
  const [formData, setFormData] = useState({ nama: '', jurusan: '' });

  // Pastikan nama file di folder /public sama dengan yang di 'img' bawah ini
  const paket = [
    { nama: 'Frame Only', harga: '150.000', desc: 'Frame Akrilik Premium 30x40 cm', img: '/frame-only.png' },
    { nama: 'Frame + Custom Design', harga: '200.000', desc: 'Frame 30x40 cm, Desain Nama & Jurusan, Free 1x Revisi', img: '/frame-custom.png' },
    { nama: 'Full Service', harga: '250.000', desc: 'Frame Akrilik Premium 30x40 cm, Desain Nama & Jurusan, Cetak 9 Foto, Free Layout & 1x Revisi', img: '/full-service.png' }
  ];

  const handlePesan = (p: { nama: string; harga: string }) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', { 
        content_name: p.nama, 
        value: p.harga.replace('.', ''), 
        currency: 'IDR' 
      });
    }

    const noWa = "628211251570"; // GANTI DENGAN NOMOR WA ANDA
    const pesan = `Halo Admin Radeya, saya mau pesan ${p.nama} (IDR ${p.harga}).%0ANama di frame: ${formData.nama}%0AJurusan: ${formData.jurusan}%0AMohon info link Google Drive untuk upload foto.`;

    window.location.href = `https://wa.me/${noWa}?text=${pesan}`;
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Head>
        <title>Pricelist Frame Kenangan | Radeya Photography</title>
      </Head>

      <h1 style={{ textAlign: 'center', color: '#333' }}>Pricelist Frame Kenangan</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Silakan isi data, pilih paket, dan pesan via WhatsApp.</p>

      <div style={{ marginBottom: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '10px', border: '1px solid #eee' }}>
        <input 
          placeholder="Nama di Frame" 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, nama: e.target.value})} 
          style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
        />
        <input 
          placeholder="Jurusan" 
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, jurusan: e.target.value})} 
          style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {paket.map((p, index) => (
          <div key={index} style={{ border: '2px solid #e0e0e0', padding: '20px', borderRadius: '12px', background: '#fff' }}>
            <img src={p.img} alt={p.nama} style={{ width: '100%', borderRadius: '8px', marginBottom: '15px' }} />
            <h3 style={{ margin: '0 0 10px 0', color: '#0070f3' }}>{p.nama} - IDR {p.harga}</h3>
            <p style={{ fontSize: '0.9em', color: '#555', marginBottom: '15px' }}>{p.desc}</p>
            <button 
              onClick={() => handlePesan(p)} 
              style={{ width: '100%', padding: '12px', background: '#25D366', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Pesan Sekarang
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
