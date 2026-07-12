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
    if (!selectedPaket || !buktiUrl) return alert('Pilih paket dan unggah bukti transfer!');
    if (!data.wa || !data.email) return alert('Mohon isi nomor WhatsApp dan Email Anda.');
    
    // 1. Kirim data ke Backend (CAPI)
    await fetch('/api/send-frame-kenangan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type: 'booking',
        value: selectedPaket.harga, 
        segment: 'frame_wisuda',
        data, 
        paket: selectedPaket, 
        buktiUrl 
      })
    });

    // 2. Tracking Purchase ke DUA Pixel (Browser side)
    if (typeof window !== 'undefined' && window.fbq) {
      const hargaBersih = parseFloat(selectedPaket.harga.replace(/\./g, ''));
      const eventData = { 
        value: hargaBersih, 
        currency: 'IDR', 
        content_name: selectedPaket.nama 
      };

      // Data untuk Advanced Matching
      const userData = {
        em: data.email,
        ph: data.wa
      };
      
      // Kirim ke Pixel Lama & Pixel Baru dengan UserData
      window.fbq('trackSingle', '804715912719122', 'Purchase', eventData, userData);
      window.fbq('trackSingle', '1413881487242621', 'Purchase', eventData, userData);
      
      console.log("Event Purchase dikirim dengan UserData:", userData);
    }

    // 3. Redirect ke WhatsApp dengan Jeda 500ms agar Pixel sempat mengirim data
    const pesan = `Halo Radeya Photography, saya ingin memesan *${selectedPaket.nama}*.
    
    *Data Desain:*
    ${data.namaTitel} | ${data.universitas} | ${data.jurusan}
    ${data.kota}, ${data.tglWisuda}
    
    *Data Pengiriman:*
    - WA: ${data.wa}
    - Opsi Atribut: ${data.opsiTambahan}
    - Alamat: ${data.alamat}
    *Bukti:* ${buktiUrl}`;

    setTimeout(() => {
      window.location.href = `https://wa.me/628211251570?text=${encodeURIComponent(pesan)}`;
    }, 500);
  };

  return (
    <>
      <Meta 
        title="Pemesanan Resmi | Radeya Photography" 
        description="Pemesanan Frame Kenangan Wisuda" 
        addPixelId="1413881487242621" 
      />
      
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
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
                  <h3 style={{ marginTop: 0 }}>Formulir Pemesanan</h3>
                  <input placeholder="Nama Lengkap & Titel" onChange={(e) => setData({...data, namaTitel: e.target.value})} style={inputStyle} />
                  <input placeholder="No. WhatsApp (Wajib)" onChange={(e) => setData({...data, wa: e.target.value})} style={inputStyle} />
                  <input type="email" placeholder="Alamat Email (Wajib)" onChange={(e) => setData({...data, email: e.target.value})} style={inputStyle} />
                  <input placeholder="Universitas" onChange={(e) => setData({...data, universitas: e.target.value})} style={inputStyle} />
                  <input placeholder="Jurusan" onChange={(e) => setData({...data, jurusan: e.target.value})} style={inputStyle} />
                  <input placeholder="Kota Wisuda" onChange={(e) => setData({...data, kota: e.target.value})} style={inputStyle} />
                  <input placeholder="Tanggal Wisuda" onChange={(e) => setData({...data, tglWisuda: e.target.value})} style={inputStyle} />
                  
                  <label style={{ fontSize: '0.85em', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Opsi Atribut Wisuda:</label>
                  <select onChange={(e) => setData({...data, opsiTambahan: e.target.value})} style={{...inputStyle, marginBottom: '15px'}}>
                    <option value="Tanpa Selempang/Medali">Tanpa Selempang/Medali</option>
                    <option value="Kirimkan atribut ke kami untuk dipasangkan">Kirimkan atribut ke kami untuk dipasangkan</option>
                    <option value="Pasang sendiri oleh klien">Pasang sendiri oleh klien</option>
                  </select>

                  <textarea placeholder="Alamat Lengkap Penerima Paket" onChange={(e) => setData({...data, alamat: e.target.value})} style={inputStyle} />
                  <label style={{ fontSize: '0.85em', fontWeight: 'bold' }}>Unggah Bukti Transfer:</label>
                  <input type="file" onChange={handleImageUpload} style={{ display: 'block', marginBottom: '15px' }} />
                  
                  <button onClick={handleCheckout} style={btnStyle}>Konfirmasi Pemesanan</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info footer tetap sama */}
      </div>
    </>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' };
const btnStyle: React.CSSProperties = { width: '100%', padding: '16px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
