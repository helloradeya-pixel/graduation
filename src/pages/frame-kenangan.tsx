import { useState } from 'react';
import Head from 'next/head';

export default function FrameKenanganPage() {
  const [data, setData] = useState({ 
    nama: '', jurusan: '', universitas: '', tglWisuda: '', alamat: '', opsiTambahan: 'Tidak menggunakan selempang/medali' 
  });
  const [selectedPaket, setSelectedPaket] = useState<any>(null);

  const paket = [
    { id: 1, nama: 'Frame Only', harga: '150.000', desc: 'Frame Akrilik Premium 30x40 cm', img: '/assets/images/frame-only.png' },
    { id: 2, nama: 'Frame + Custom Design', harga: '200.000', desc: 'Frame 30x40 cm, Desain Nama & Jurusan, Free 1x Revisi', img: '/assets/images/frame-custom.png' },
    { id: 3, nama: 'Full Service', harga: '250.000', desc: 'Frame Akrilik Premium 30x40 cm, Desain Nama & Jurusan, Cetak 9 Foto, Free Layout & 1x Revisi', img: '/assets/images/full-service.png' }
  ];

  const handleCheckout = () => {
    if (!selectedPaket) return alert('Silakan pilih paket terlebih dahulu.');
    
    const pesan = `Halo Radeya Photography, saya ingin melakukan pemesanan untuk *${selectedPaket.nama}*.
    
    *Data Pesanan:*
    - Nama & Titel: ${data.nama}
    - Jurusan: ${data.jurusan}
    - Universitas: ${data.universitas}
    - Tgl Wisuda: ${data.tglWisuda}
    - Opsi Atribut: ${data.opsiTambahan}
    - Alamat Pengiriman: ${data.alamat}
    
    Mohon informasi selanjutnya terkait pembayaran dan mekanisme pengiriman foto. Terima kasih.`;

    window.location.href = `https://wa.me/628211251570?text=${encodeURIComponent(pesan)}`;
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <Head><title>Pemesanan Resmi | Radeya Photography</title></Head>

      <h1 style={{ textAlign: 'center', color: '#1a1a1a', marginBottom: '10px' }}>Pilih Paket Layanan</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Solusi premium untuk mengabadikan momen wisuda Anda.</p>

      {/* Deskripsi Alur Pemesanan */}
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #e0e0e0' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Alur Pemesanan & Produksi:</h4>
        <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9em', color: '#444', lineHeight: '1.8' }}>
          <li><b>Pilih Paket:</b> Tentukan layanan yang paling sesuai dengan kebutuhan momen wisuda Anda.</li>
          <li><b>Checkout:</b> Isi formulir data diri dengan lengkap agar pesanan dapat segera kami proses.</li>
          <li><b>Konfirmasi & Pembayaran:</b> Admin akan menghubungi Anda untuk memberikan detail pembayaran melalui rekening resmi usaha Radeya Photography.</li>
          <li><b>Pengunggahan Foto:</b> Setelah pembayaran terverifikasi, Anda akan mendapatkan akses ke folder Google Drive pribadi untuk memastikan kualitas foto tetap terjaga.</li>
          <li><b>Produksi & Pengiriman:</b> Bingkai akan diproduksi dan segera dikirim ke alamat Anda. (Untuk atribut wisuda, Anda dapat mengirimkannya ke studio kami untuk dipasangkan atau memasangnya secara mandiri).</li>
        </ol>
      </div>

      {/* Produk */}
      <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
        {paket.map((p) => (
          <div key={p.id} onClick={() => setSelectedPaket(p)} style={{ 
              border: selectedPaket?.id === p.id ? '2px solid #000' : '1px solid #ddd',
              padding: '20px', borderRadius: '12px', cursor: 'pointer', background: '#fff', transition: '0.2s' 
          }}>
            <img src={p.img} alt={p.nama} style={{ width: '100%', borderRadius: '6px', marginBottom: '15px' }} />
            <div style={{ fontWeight: 'bold', fontSize: '1.1em', color: '#000' }}>{p.nama} - IDR {p.harga}</div>
            <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>{p.desc}</div>
          </div>
        ))}
      </div>

      {/* Form */}
      {selectedPaket && (
        <div style={{ background: '#fdfdfd', padding: '25px', borderRadius: '12px', border: '1px solid #eee' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Formulir Pemesanan</h3>
          <input placeholder="Nama Lengkap & Titel" onChange={(e) => setData({...data, nama: e.target.value})} style={inputStyle} />
          <input placeholder="Jurusan" onChange={(e) => setData({...data, jurusan: e.target.value})} style={inputStyle} />
          <input placeholder="Universitas" onChange={(e) => setData({...data, universitas: e.target.value})} style={inputStyle} />
          <input placeholder="Tanggal Wisuda" onChange={(e) => setData({...data, tglWisuda: e.target.value})} style={inputStyle} />
          
          <label style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#333' }}>Opsi Atribut Wisuda:</label>
          <select onChange={(e) => setData({...data, opsiTambahan: e.target.value})} style={{...inputStyle, marginBottom: '15px'}}>
            <option value="Tidak menggunakan selempang/medali">Tidak menggunakan selempang/medali</option>
            <option value="Kirim ke studio untuk dipasangkan">Kirim ke studio untuk dipasangkan</option>
            <option value="Pasang sendiri oleh klien">Pasang sendiri oleh klien</option>
          </select>

          <textarea placeholder="Alamat Lengkap Pengiriman" onChange={(e) => setData({...data, alamat: e.target.value})} style={{...inputStyle, height: '80px'}} />

          <button onClick={handleCheckout} style={{ width: '100%', padding: '16px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            Konfirmasi Pemesanan
          </button>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = { 
  width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' 
};
