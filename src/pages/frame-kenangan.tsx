import { useState } from 'react';
import Head from 'next/head';

export default function FrameKenanganPage() {
  const [data, setData] = useState({ 
    nama: '', titel: '', jurusan: '', universitas: '', kota: '', tglWisuda: '', alamat: '', opsiTambahan: 'Tidak menggunakan selempang/medali' 
  });
  const [selectedPaket, setSelectedPaket] = useState<any>(null);

  const paket = [
    { id: 1, nama: 'Frame Only', harga: '150.000', desc: 'Frame Akrilik Premium 30x40 cm', img: '/assets/images/frame-only.png' },
    { id: 2, nama: 'Frame + Custom Design', harga: '200.000', desc: 'Frame 30x40 cm, Desain Nama & Jurusan, Free 1x Revisi', img: '/assets/images/frame-custom.png' },
    { id: 3, nama: 'Full Service', harga: '250.000', desc: 'Frame Akrilik Premium 30x40 cm, Desain Nama & Jurusan, Cetak 9 Foto, Free Layout & 1x Revisi', img: '/assets/images/full-service.png' }
  ];

  const handleCheckout = () => {
    if (!selectedPaket) return alert('Silakan pilih paket terlebih dahulu.');
    
    const pesan = `Halo Radeya Photography, saya ingin memesan *${selectedPaket.nama}*.
    
    *Data Desain:*
    ${data.nama}
    ${data.titel}
    ${data.universitas}
    ${data.jurusan}
    ${data.kota}, ${data.tglWisuda}
    
    *Data Pengiriman:*
    - Opsi Atribut: ${data.opsiTambahan}
    - Alamat: ${data.alamat}
    
    *Saya telah melakukan transfer sebesar Rp${selectedPaket.harga}. Bukti transfer saya lampirkan bersama pesan ini.*`;

    window.location.href = `https://wa.me/628211251570?text=${encodeURIComponent(pesan)}`;
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <Head><title>Pemesanan Resmi | Radeya Photography</title></Head>

      <h1 style={{ textAlign: 'center', color: '#1a1a1a', marginBottom: '30px' }}>Pilih Paket Layanan</h1>
      
      <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
        {paket.map((p) => (
          <div key={p.id} onClick={() => setSelectedPaket(p)} style={{ 
              border: selectedPaket?.id === p.id ? '2px solid #000' : '1px solid #ddd',
              padding: '20px', borderRadius: '12px', cursor: 'pointer', background: '#fff' 
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{p.nama} - IDR {p.harga}</div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>{p.desc}</div>
          </div>
        ))}
      </div>

      {selectedPaket && (
        <div style={{ background: '#fdfdfd', padding: '25px', borderRadius: '12px', border: '1px solid #eee' }}>
          <h3 style={{ marginTop: 0 }}>Formulir Data Desain</h3>
          <input placeholder="Nama Lengkap" onChange={(e) => setData({...data, nama: e.target.value})} style={inputStyle} />
          <input placeholder="Titel / Gelar (contoh: S.Pi.)" onChange={(e) => setData({...data, titel: e.target.value})} style={inputStyle} />
          <input placeholder="Universitas" onChange={(e) => setData({...data, universitas: e.target.value})} style={inputStyle} />
          <input placeholder="Jurusan" onChange={(e) => setData({...data, jurusan: e.target.value})} style={inputStyle} />
          <input placeholder="Kota Wisuda" onChange={(e) => setData({...data, kota: e.target.value})} style={inputStyle} />
          <input placeholder="Tanggal Wisuda" onChange={(e) => setData({...data, tglWisuda: e.target.value})} style={inputStyle} />
          
          <h3 style={{ marginTop: '20px' }}>Pembayaran</h3>
          <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9em' }}>
            Silakan lakukan transfer ke rekening resmi usaha kami:<br/>
            <b>Bank BCA: 1234567890</b><br/>
            <b>A.N: Radeya Photography</b><br/>
            <i>Harap lampirkan bukti transfer saat menekan tombol konfirmasi.</i>
          </div>

          <h3 style={{ marginTop: '20px' }}>Data Pengiriman</h3>
          <select onChange={(e) => setData({...data, opsiTambahan: e.target.value})} style={{...inputStyle, marginBottom: '15px'}}>
            <option value="Tanpa Selempang/Medali">Tanpa Selempang/Medali</option>
            <option value="Kirimkan kepada kami untuk dipasangkan">Kirim atribut ke kami untuk dipasang</option>
            <option value="Pasang sendiri oleh klien">Pasang sendiri oleh klien</option>
          </select>
          <textarea placeholder="Alamat Lengkap Pengiriman" onChange={(e) => setData({...data, alamat: e.target.value})} style={{...inputStyle, height: '80px'}} />

          <button onClick={handleCheckout} style={{ width: '100%', padding: '16px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            Konfirmasi Pesanan & Kirim Bukti Transfer
          </button>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = { 
  width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' 
};
