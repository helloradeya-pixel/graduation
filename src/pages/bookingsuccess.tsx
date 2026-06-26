  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);

    // =========================
    // 1. AMBIL DATA
    // =========================
    const service = params.get('service') || 'unknown';
    const nama = params.get('nama') || '';
    const email = params.get('email') || ''; // Email dari Tally
    const rawWa = params.get('wa') || '';
    const paket = params.get('package') || '';
    const tanggal = params.get('tanggal') || '';
    const jamMulai = params.get('jam_mulai') || '';
    const jamSelesai = params.get('jam_selesai') || '';
    
    // =========================
    // 2. HELPER FUNGSI
    // =========================
    const normalizePhone = (phone: string) => {
      let cleaned = phone.replace(/\D/g, ''); 
      return cleaned.startsWith('0') ? '62' + cleaned.substring(1) : cleaned;
    };

    const getFbc = () => {
      const match = document.cookie.match(/_fbc=([^;]+)/);
      return match ? match[1] : localStorage.getItem('fbc') || undefined;
    };

    const normalizedWA = normalizePhone(rawWa);
    const fbc = getFbc();
    const eventId = `${service}_booking_${Date.now()}`;
    
    const dpRaw = params.get('dp') || '0';
    const value = Number(dpRaw) < 5000 ? Number(dpRaw) * 1000 : Number(dpRaw);

    // =========================
    // 3. META PIXEL (Browser)
    // =========================
    window.fbq?.('track', 'Purchase', {
      value,
      currency: 'IDR',
      content_name: `Booking_${service}`,
      service,
      user_data: { 
        ph: normalizedWA,
        em: email,
        fbc: fbc 
      }
    }, { eventID: eventId });

    // =========================
    // 4. CAPI (Server-side)
    // =========================
    fetch('/api/meta-capi', { // PASTIKAN NAMA FILE API ANDA 'meta-capi.ts'
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service,
        value,
        event_id: eventId,
        type: 'booking',
        user_data: { 
          ph: normalizedWA,
          em: email,    // PENTING
          fn: nama,     // PENTING
          fbc: fbc      // PENTING
        }
      }),
    }).catch(err => console.log('CAPI ERROR:', err));

    // =========================
    // 5. REDIRECT
    // =========================
    const message = `Halo kak, saya ${nama} sudah booking ${service}\nPackage: ${paket}\nTanggal: ${tanggal}\nJam: ${jamMulai} - ${jamSelesai}\nDP: Rp${value.toLocaleString('id-ID')}`;
    const waLink = `https://wa.me/628211251570?text=${encodeURIComponent(message)}`;

    const timer = setTimeout(() => { window.location.href = waLink; }, 3000);
    return () => clearTimeout(timer);
  }, []);
