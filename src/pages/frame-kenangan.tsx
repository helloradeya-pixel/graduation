import { useState } from 'react';
import Head from 'next/head';

export default function FrameKenanganPage() {
  const [data, setData] = useState({ nama: '', jurusan: '', universitas: '', tglWisuda: '', alamat: '' });
  const [selectedPaket, setSelectedPaket] = useState<any>(null);

  const paket = [
    { id: 1, nama: 'Frame Only', harga: '150.000', desc: 'Frame Akrilik Premium 30x40 cm', img: '/assets/images/frame-only.png' },
    { id: 2, nama: 'Frame + Custom Design', harga: '200.000', desc: 'Frame 30x40 cm, Desain Nama & Jurusan, Free 1x Revisi', img: '/assets/images/frame-custom.png' },
    { id: 3, nama: 'Full Service', harga: '250.000', desc: 'Frame Akrilik Premium 30x40 cm, Desain Nama & Jurusan, Cetak 9 Foto, Free Layout & 1x Revisi', img: '/assets/images/full-service.png' }
  ];

  const handleCheckout = () => {
    if (!selectedPaket) return alert('Pilih paket terlebih dahulu!');
    
    const pesan = `Halo Admin Radeya, saya mau pesan: *${selectedPaket.nama}* (IDR ${selectedPaket.harga})
    
    *Data Pesanan:*
    - Nama & Titel: ${data.nama}
    - Jurusan: ${data.jurusan}
    - Universitas: ${data.universitas}
    - Tgl Wisuda: ${data.tglWisuda}
    - Alamat: ${data.alamat}
    
    Mohon info link Google Drive untuk upload foto.`;

    window.location.href = `https://wa.me/628211251570?text=${encodeURIComponent(pesan)}`;
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Head><title>Toko Radeya Photography</title></Head>

      <h1 style={{ textAlign: 'center', color: '#333' }}>Pilih Paket Kenangan</h1>

      {/* Grid Produk */}
      <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
        {paket.map((p) => (
          <div 
            key={p.id} 
            onClick={() => setSelectedPaket(p)}
            style={{ 
              border: selectedPaket?.id === p.id ? '3px solid #25D366' : '1px solid #ddd',
              padding: '15px', borderRadius: '12px', cursor: 'pointer', background: '#fff',
              transition: '0.3s'
            }}
          >
            <img src={p.img} alt={p.nama} style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />
            <div style={{ fontWeight: 'bold', fontSize: '1.2em', color: '#0070f3' }}>{p.nama} - IDR {p.harga}</div>
            <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>{p.desc}</div>
          </div>
        ))}
      </div>

      {/* Form Checkout */}
      {selectedPaket && (
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', border: '1px solid #eee' }}>
          <h3 style={{ marginTop: 0 }}>Lengkapi Data (Checkout)</h3>
          
          <input placeholder="Nama Lengkap & Titel" onChange={(e) => setData({...data, nama: e.target.value})} style={inputStyle} />
          <input placeholder="Jurusan" onChange={(e) => setData({...data, jurusan: e.target.value})} style={inputStyle} />
          <input placeholder="Universitas" onChange={(e) => setData({...data, universitas: e.target.value})} style={inputStyle} />
          <input placeholder="Tanggal Wisuda" onChange={(e) => setData({...data, tglWisuda: e.target.value})} style={inputStyle} />
          <textarea placeholder="Alamat Lengkap Penerima" onChange={(e) => setData({...data, alamat: e.target.value})} style={{...inputStyle, height: '80px'}} />

          <button 
            onClick={handleCheckout}
            style={{ width: '100%', padding: '15px', background: '#25D366', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1em' }}
          >
            Checkout via WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = { 
  width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' 
};
