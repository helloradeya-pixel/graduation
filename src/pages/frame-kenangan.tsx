import { useState } from 'react';
import Head from 'next/head';

export default function FrameKenanganPage() {
  const [data, setData] = useState({ 
    namaTitel: '', jurusan: '', universitas: '', kota: '', tglWisuda: '', alamat: '', opsiTambahan: 'Tanpa Selempang/Medali' 
  });
  const [selectedPaket, setSelectedPaket] = useState<any>(null);
  const [buktiUrl, setBuktiUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const paket = [
    { id: 1, nama: 'Frame Only', harga: '150.000', desc: 'Frame Akrilik Premium 30x40 cm', img: '/assets/images/frame-only.png' },
    { id: 2, nama: 'Frame + Custom Design', harga: '200.000', desc: 'Frame 30x40 cm, Desain Nama & Jurusan, Free 1x Revisi', img: '/assets/images/frame-custom.png' },
    { id: 3, nama: 'Full Service', harga: '250.000', desc: 'Frame Akrilik Premium 30x40 cm, Desain Nama & Jurusan, Cetak 9 Foto, Free Layout & 1x Revisi', img: '/assets/images/full-service.png' }
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
    } catch (err) { alert('Gagal unggah foto.'); } finally { setIsUploading(false); }
  };

  const handleCheckout = async () => {
    if (!selectedPaket || !buktiUrl) return alert('Pilih paket dan unggah bukti transfer!');
    
    await fetch('/api/send-to-notion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, paket: selectedPaket, buktiUrl })
    });

    const pesan = `Halo Radeya Photography, saya ingin memesan *${selectedPaket.nama}*.
    *Data Desain:* ${data.namaTitel} | ${data.universitas} | ${data.jurusan} | ${data.kota}, ${data.tglWisuda}
    *Data Pengiriman:* ${data.opsiTambahan} | Alamat: ${data.alamat}
    *Bukti:* ${buktiUrl}`;

    window.location.href = `https://wa.me/628211251570?text=${encodeURIComponent(pesan)}`;
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <Head><title>Pemesanan Resmi | Radeya Photography</title></Head>

      <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Pilih Paket Layanan</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Solusi premium untuk momen wisuda Anda.</p>

      {/* Alur Pemesanan */}
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', border: '1px solid #e0e0e0', marginBottom: '30px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Alur Pemesanan:</h4>
        <ol style={{ fontSize: '0.9em', paddingLeft: '20px' }}>
          <li>Klik paket yang diinginkan.</li>
          <li>Formulir akan muncul tepat di bawah paket.</li>
          <li>Isi data, transfer ke BCA 1234567890 a.n Radeya Photography, dan upload bukti.</li>
        </ol>
      </div>

      {/* Grid Paket */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {paket.map((p) => (
          <div key={p.id}>
            {/* Kartu Paket */}
            <div onClick={() => setSelectedPaket(p)} style={{ 
                border: selectedPaket?.id === p.id ? '2px solid #000' : '1px solid #ddd',
                padding: '20px', borderRadius: '12px', cursor: 'pointer', background: '#fff' 
            }}>
              <img src={p.img} alt={p.nama} style={{ width: '100%', borderRadius: '6px' }} />
              <div style={{ fontWeight: 'bold', marginTop: '10px' }}>{p.nama} - IDR {p.harga}</div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>{p.desc}</div>
            </div>

            {/* Form Hanya Muncul di Bawah Paket yang Dipilih */}
            {selectedPaket?.id === p.id && (
              <div style={{ background: '#fdfdfd', padding: '20px', borderRadius: '12px', border: '1px solid #000', marginTop: '10px' }}>
                <h3 style={{ marginTop: 0 }}>Formulir Pemesanan</h3>
                <input placeholder="Nama Lengkap & Titel" onChange={(e) => setData({...data, namaTitel: e.target.value})} style={inputStyle} />
                <input placeholder="Universitas" onChange={(e) => setData({...data, universitas: e.target.value})} style={inputStyle} />
                <input placeholder="Jurusan" onChange={(e) => setData({...data, jurusan: e.target.value})} style={inputStyle} />
                <input placeholder="Kota Wisuda" onChange={(e) => setData({...data, kota: e.target.value})} style={inputStyle} />
                <input placeholder="Tanggal Wisuda" onChange={(e) => setData({...data, tglWisuda: e.target.value})} style={inputStyle} />
                
                <div style={{ background: '#eee', padding: '10px', borderRadius: '6px', fontSize: '0.85em', marginBottom: '15px' }}>
                  Transfer ke BCA 1234567890 a.n Radeya Photography
                </div>
                
                <label style={{ fontSize: '0.85em', fontWeight: 'bold' }}>Unggah Bukti Transfer:</label>
                <input type="file" onChange={handleImageUpload} style={{ display: 'block', marginBottom: '15px' }} />
                
                <select onChange={(e) => setData({...data, opsiTambahan: e.target.value})} style={inputStyle}>
                  <option>Tanpa Selempang/Medali</option>
                  <option>Kirimkan atribut ke kami untuk dipasangkan</option>
                  <option>Pasang sendiri oleh klien</option>
                </select>
                <textarea placeholder="Alamat Lengkap" onChange={(e) => setData({...data, alamat: e.target.value})} style={inputStyle} />

                <button onClick={handleCheckout} style={btnStyle} disabled={!buktiUrl}>
                  {buktiUrl ? 'Konfirmasi Pesanan' : 'Harap Unggah Bukti Transfer'}
                </button>
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
