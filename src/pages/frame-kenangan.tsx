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
    formData.append('upload_preset', 'preset_radeyaframe'); // Pastikan preset ini sudah Unsigned di Cloudinary

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
    
    // Kirim data ke Notion
    await fetch('/api/send-to-notion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, paket: selectedPaket, buktiUrl })
    });

    const pesan = `Halo Radeya Photography, saya ingin memesan *${selectedPaket.nama}*.
    
    *Data Desain:*
    ${data.namaTitel}
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

      <h1 style={{ textAlign: 'center', color: '#1a1a1a', marginBottom: '10px' }}>Pilih Paket Layanan</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Solusi premium untuk mengabadikan momen wisuda Anda.</p>

      {/* Alur Pemesanan */}
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #e0e0e0' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Alur Pemesanan & Produksi:</h4>
        <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9em', color: '#444', lineHeight: '1.8' }}>
          <li><b>Pilih Paket:</b> Tentukan layanan yang paling sesuai dengan kebutuhan momen wisuda Anda.</li>
          <li><b>Checkout:</b> Isi formulir data diri dengan lengkap agar pesanan dapat segera kami proses.</li>
          <li><b>Konfirmasi & Pembayaran:</b> Transfer ke BCA 1234567890 a.n Radeya Photography.</li>
          <li><b>Pengunggahan Foto:</b> Setelah pembayaran terverifikasi, Anda akan mendapatkan akses ke folder Google Drive pribadi untuk memastikan kualitas foto tetap terjaga.</li>
          <li><b>Produksi & Pengiriman:</b> Estimasi pengerjaan adalah 7-10 hari kerja setelah foto diterima. (Untuk atribut wisuda, Anda dapat mengirimkannya kepada kami untuk dipasangkan atau memasangnya secara mandiri).</li>
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
          
          <input placeholder="Nama Lengkap & Titel (Contoh: Asiah Munawaroh, S.Pi.)" onChange={(e) => setData({...data, namaTitel: e.target.value})} style={inputStyle} />
          <input placeholder="Universitas" onChange={(e) => setData({...data, universitas: e.target.value})} style={inputStyle} />
          <input placeholder="Jurusan" onChange={(e) => setData({...data, jurusan: e.target.value})} style={inputStyle} />
          <input placeholder="Kota Wisuda" onChange={(e) => setData({...data, kota: e.target.value})} style={inputStyle} />
          <input placeholder="Tanggal Wisuda" onChange={(e) => setData({...data, tglWisuda: e.target.value})} style={inputStyle} />
          
          <div style={{ background: '#eee', padding: '15px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.9em' }}>
            Transfer ke <b>BCA 1234567890</b> a.n <b>Radeya Photography</b>
          </div>

          <label style={{ fontSize: '0.85em', fontWeight: 'bold' }}>Unggah Bukti Transfer:</label>
          <input type="file" onChange={handleImageUpload} style={{ marginBottom: '15px', display: 'block' }} />
          {isUploading && <p>Mengunggah bukti...</p>}
          
          <label style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#333' }}>Opsi Atribut Wisuda:</label>
          <select onChange={(e) => setData({...data, opsiTambahan: e.target.value})} style={{...inputStyle, marginBottom: '15px'}}>
            <option value="Tanpa Selempang/Medali">Tanpa Selempang/Medali</option>
            <option value="Kirimkan kepada kami untuk dipasangkan">Kirimkan kepada kami untuk dipasangkan</option>
            <option value="Pasang sendiri oleh klien">Pasang sendiri oleh klien</option>
          </select>

          <textarea placeholder="Alamat Lengkap Pengiriman" onChange={(e) => setData({...data, alamat: e.target.value})} style={{...inputStyle, height: '80px'}} />

          <button onClick={handleCheckout} style={btnStyle} disabled={!buktiUrl}>
            {buktiUrl ? 'Konfirmasi Pemesanan' : 'Harap Unggah Bukti Transfer'}
          </button>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = { 
  width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' 
};

const btnStyle: React.CSSProperties = { 
  width: '100%', padding: '16px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' 
};
