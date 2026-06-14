import { useEffect } from 'react';

export default function BookingSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const service = params.get('service');

    let message = '';

    if (service === 'graduation') {
      const nama = params.get('nama') || '';
      const paket = params.get('package') || '';
      const tanggal = params.get('tanggal') || '';
      const jamMulai = params.get('jam_mulai') || '';
      const jamSelesai = params.get('jam_selesai') || '';
      const dp = params.get('dp') || '';

      message =
        `Halo kak, sudah booking atas nama ${nama} ` +
        `package ${paket} ` +
        `di tanggal ${tanggal} ` +
        `di jam ${jamMulai} ` +
        `sampai jam ${jamSelesai} yah kak!\n` +
        `( DP ): ${dp}`;
    }

    if (service === 'couple') {
      const nama = params.get('nama') || '';
      const dp = params.get('dp') || '';

      message =
        `Halo kak, sudah booking atas nama ${nama} yah kak!\n` +
        `( DP ): ${dp}`;
    }

    setTimeout(() => {
      window.location.href =
        `https://wa.me/628211251570?text=${encodeURIComponent(message)}`;
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1>Booking Berhasil</h1>
        <p>Sedang menghubungkan ke WhatsApp...</p>
      </div>
    </div>
  );
}
