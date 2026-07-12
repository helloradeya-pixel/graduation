import { useState } from 'react';
import { Meta } from '../layout/Meta'; 

export default function FrameKenanganPage() {
  const [data, setData] = useState({ 
    namaTitel: '', jurusan: '', universitas: '', kota: '', tglWisuda: '', alamat: '', 
    wa: '', email: '', opsiTambahan: 'Tanpa Selempang/Medali' 
  });
  const [selectedPaket, setSelectedPaket] = useState<any>(null);
  const [buktiUrl, setBuktiUrl] = useState('');

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
    if (!selectedPaket || !buktiUrl) return alert('Mohon pilih paket dan unggah bukti transfer Anda.');
    if (!data.wa || !data.email) return alert('Mohon lengkapi nomor WhatsApp dan Email Anda.');
    
    await fetch('/api/send-frame-kenangan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'booking', value: selectedPaket.harga, segment: 'frame_wisuda', data, paket: selectedPaket, buktiUrl })
    });

    if (typeof window !== 'undefined' && window.fbq) {
      const hargaBersih = parseFloat(selectedPaket.harga.replace(/\./g, ''));
      const eventData = { value: hargaBersih, currency: 'IDR', content_name: selectedPaket.nama };
      const userData = { em: data.email, ph: data.wa };
      
      window.fbq('trackSingle', '804715912719122', 'Purchase', eventData, userData);
      window.fbq('trackSingle', '1413881487242621', 'Purchase', eventData, userData);
    }

    const pesan = `Halo Radeya Photography, saya ingin memesan *${selectedPaket.nama}*.
    \n*Data Desain:* ${data.namaTitel} | ${data.universitas} | ${data.jurusan}
    \n*Detail Atribut:* ${data.opsiTambahan}
    \n*Data Pengiriman:* ${data.alamat}
    \n*Bukti Transfer:* ${buktiUrl}`;

    setTimeout(() => {
      window.location.href = `https://wa.me/628211251570?text=${encodeURIComponent(pesan)}`;
    }, 500);
  };

  return (
    <>
      <Meta title="Pemesanan Resmi | Radeya Photography" description="Pemesanan Frame Kenangan Wisuda" addPixelId="1413881487242621" />
      
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Pilih Paket Layanan</h1>
        
        {/* TATA CARA PEMESANAN */}
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', border: '1px solid #e0e0e0', marginBottom: '30px' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Cara Pemesanan & Alur Produksi:</h4>
          <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9em', color: '#444', lineHeight: '1.8' }}>
            <li><b>Pilih & Checkout:</b> Silakan pilih paket yang diinginkan, kemudian lengkapi data desain serta alamat pengiriman dengan saksama.</li>
            <li><b>Pembayaran:</b> Mohon kesediaannya melakukan transfer investasi layanan ke <b>BCA 2952093623 (a.n. Yulviana Kusnia)</b>. <i>Catatan: Harga belum termasuk ongkos kirim.</i> Mohon lampirkan bukti transfer pada formulir.</li>
            <li><b>Verifikasi & Pengunggahan Foto:</b> Setelah pembayaran terverifikasi, tim kami akan segera menghubungi Anda melalui WhatsApp untuk pengunggahan materi foto resolusi tinggi.</li>
            <li><b>Proses Desain:</b> Tim desainer kami akan menyusun pratinjau (draft) desain untuk mendapatkan persetujuan Anda sebelum tahap produksi.</li>
            <li><b>Produksi & Pengiriman:</b> Bingkai akan memasuki tahap produksi eksklusif (estimasi 7-10 hari kerja). Jika Anda menggunakan selempang/medali, Anda dapat memilih untuk mengirimkannya kepada kami agar dipasangkan, atau memasangnya secara mandiri setelah bingkai tiba.</li>
          </ol>
        </div>

        <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
          {paket.map((p) => (
            <div key={p.id}>
              <div onClick={() => setSelectedPaket(p)} style={{ 
                  border: selectedPaket?.id === p.id ? '2px solid #000' : '1px solid #ddd',
                  padding: '20px', borderRadius: '12px', cursor: 'pointer', background: '#fff'
              }}>
                <div style={{ fontWeight: 'bold', textAlign: 'center' }}>{p.nama} - IDR {p.harga}</div>
              </div>
              {selectedPaket?.id === p.id && (
                <div style={{ padding: '20px', border: '1px solid #000', marginTop: '10px', borderRadius: '12px' }}>
                  <input placeholder="Nama Lengkap & Titel" onChange={(e) => setData({...data, namaTitel: e.target.value})} style={inputStyle} />
                  <input placeholder="No. WhatsApp" onChange={(e) => setData({...data, wa: e.target.value})} style={inputStyle} />
                  <input type="email" placeholder="Alamat Email" onChange={(e) => setData({...data, email: e.target.value})} style={inputStyle} />
                  <input placeholder="Universitas" onChange={(e) => setData({...data, universitas: e.target.value})} style={inputStyle} />
                  <input placeholder="Jurusan" onChange={(e) => setData({...data, jurusan: e.target.value})} style={inputStyle} />
                  <input placeholder="Kota Wisuda" onChange={(e) => setData({...data, kota: e.target.value})} style={inputStyle} />
                  <input placeholder="Tanggal Wisuda" onChange={(e) => setData({...data, tglWisuda: e.target.value})} style={inputStyle} />
                  <select onChange={(e) => setData({...data, opsiTambahan: e.target.value})} style={{...inputStyle, marginBottom: '15px'}}>
                    <option value="Tanpa Selempang/Medali">Tanpa Selempang/Medali</option>
                    <option value="Kirimkan atribut ke kami untuk dipasangkan">Kirimkan atribut ke Radeya agar dipasangkan</option>
                    <option value="Pasang sendiri oleh klien">Pasang sendiri oleh klien</option>
                  </select>
                  <textarea placeholder="Alamat Lengkap Pengiriman" onChange={(e) => setData({...data, alamat: e.target.value})} style={inputStyle} />
                  <label style={{ fontSize: '0.85em', fontWeight: 'bold' }}>Unggah Bukti Transfer:</label>
                  <input type="file" onChange={handleImageUpload} style={{ display: 'block', marginBottom: '15px' }} />
                  <button onClick={handleCheckout} style={btnStyle}>Konfirmasi Pemesanan</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '48px', borderTop: '1px solid #eee', paddingTop: '24px', textAlign: 'center', fontSize: '0.9em' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Radeya Photography</p>
          <p style={{ margin: '0' }}>WhatsApp: 0821-1251-570</p>
          <p style={{ margin: '0' }}>Cariu RT 05/RW 01, Desa Talagasari, Kecamatan Balaraja, Kabupaten Tangerang, Banten 15610</p>
          <a href="https://www.google.com/maps/search/?api=1&query=Radeya+Photography+Balaraja" target="_blank" rel="noreferrer" style={{ color: '#000', textDecoration: 'underline', marginTop: '10px', display: 'block' }}>Lihat di Google Maps</a>
          <div style={{ marginTop: '30px', fontSize: '12px', color: '#737373' }}>© 2026 Radeyaphoto. All rights reserved.</div>
        </div>
      </div>
    </>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' };
const btnStyle: React.CSSProperties = { width: '100%', padding: '16px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
