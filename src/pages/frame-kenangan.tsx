import { useState } from 'react';
import Head from 'next/head';

export default function FrameKenanganPage() {
  const [data, setData] = useState({ 
    nama: '', titel: '', jurusan: '', universitas: '', kota: '', tglWisuda: '', alamat: '', opsiTambahan: 'Tanpa Selempang/Medali' 
  });
  const [selectedPaket, setSelectedPaket] = useState<any>(null);
  const [buktiUrl, setBuktiUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const paket = [
    { id: 1, nama: 'Frame Only', harga: '150.000', desc: 'Frame Akrilik Premium 30x40 cm' },
    { id: 2, nama: 'Frame + Custom Design', harga: '200.000', desc: 'Frame 30x40 cm, Desain Nama & Jurusan, Free 1x Revisi' },
    { id: 3, nama: 'Full Service', harga: '250.000', desc: 'Frame Akrilik Premium 30x40 cm, Desain Nama & Jurusan, Cetak 9 Foto, Free Layout & 1x Revisi' }
  ];

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    
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
    } catch (err) {
      alert('Gagal unggah foto, silakan coba lagi.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedPaket || !buktiUrl) return alert('Pilih paket dan unggah bukti transfer dulu ya!');

    // Kirim ke API Notion Anda
    await fetch('/api/send-to-notion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, paket: selectedPaket, buktiUrl })
    });

    // Kirim pesan ke WhatsApp
    const pesan = `Halo Radeya Photography, saya ingin memesan *${selectedPaket.nama}*.
    
    *Data Desain:*
    ${data.nama} ${data.titel}
    ${data.universitas}
    ${data.jurusan}
    ${data.kota}, ${data.tglWisuda}
    
    *Data Pengiriman:*
    - Opsi Atribut: ${data.opsiTambahan}
    - Alamat: ${data.alamat}
    
    *Bukti Transfer:* ${buktiUrl}`;

    window.location.href = `https://wa.me/628211251570?text=${encodeURIComponent(pesan)}`;
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <Head><title>Pemesanan Resmi | Radeya Photography</title></Head>

      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Pemesanan Radeya Photography</h1>

      {/* Daftar Paket */}
      <div style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
        {paket.map((p) => (
          <div key={p.id} onClick={() => setSelectedPaket(p)} style={{ 
              border: selectedPaket?.id === p.id ? '2px solid #000' : '1px solid #ddd',
              padding: '15px', borderRadius: '10px', cursor: 'pointer' 
          }}>
            <div style={{ fontWeight: 'bold' }}>{p.nama} - IDR {p.harga}</div>
            <div style={{ fontSize: '0.8em', color: '#666' }}>{p.desc}</div>
          </div>
        ))}
      </div>

      {selectedPaket && (
        <div style={{ background: '#fdfdfd', padding: '25px', borderRadius: '12px', border: '1px solid #eee' }}>
          <h3>Formulir Data Desain</h3>
          <input placeholder="Nama Lengkap" onChange={(e) => setData({...data, nama: e.target.value})} style={inputStyle} />
          <input placeholder="Titel / Gelar (contoh: S.Pi.)" onChange={(e) => setData({...data, titel: e.target.value})} style={inputStyle} />
          <input placeholder="Universitas" onChange={(e) => setData({...data, universitas: e.target.value})} style={inputStyle} />
          <input placeholder="Jurusan" onChange={(e) => setData({...data, jurusan: e.target.value})} style={inputStyle} />
          <input placeholder="Kota Wisuda" onChange={(e) => setData({...data, kota: e.target.value})} style={inputStyle} />
          <input placeholder="Tanggal Wisuda" onChange={(e) => setData({...data, tglWisuda: e.target.value})} style={inputStyle} />

          <h3 style={{ marginTop: '20px' }}>Pembayaran</h3>
          <div style={{ background: '#eee', padding: '10px', borderRadius: '6px', fontSize: '0.85em', marginBottom: '15px' }}>
            Transfer ke BCA 1234567890 a.n Radeya Photography
          </div>
          <input type="file" onChange={handleImageUpload} style={{ marginBottom: '10px' }} />
          {isUploading && <p>Mengunggah...</p>}

          <h3 style={{ marginTop: '20px' }}>Data Pengiriman</h3>
          <select onChange={(e) => setData({...data, opsiTambahan: e.target.value})} style={inputStyle}>
            <option>Tanpa Selempang/Medali</option>
            <option>Kirimkan kepada kami untuk dipasangkan</option>
            <option>Pasang sendiri oleh klien</option>
          </select>
          <textarea placeholder="Alamat Lengkap" onChange={(e) => setData({...data, alamat: e.target.value})} style={inputStyle} />

          <button onClick={handleCheckout} style={btnStyle} disabled={!buktiUrl}>
            {buktiUrl ? 'Konfirmasi Pesanan' : 'Harap Unggah Bukti Transfer'}
          </button>
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '16px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
