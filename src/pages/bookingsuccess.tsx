import { useEffect } from 'react';

export default function BookingSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const nama = params.get('nama');

    setTimeout(() => {
      window.location.href =
        `https://wa.me/628211251570?text=${encodeURIComponent(
          `Nama dari URL: ${nama}`
        )}`;
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
