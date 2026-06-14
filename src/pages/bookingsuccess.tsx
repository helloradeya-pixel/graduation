import { useEffect } from 'react';

export default function BookingSuccess() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href =
        'https://wa.me/628211251570?text=TEST%20BOOKING%20RADEYA';
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          Booking Berhasil
        </h1>

        <p>
          Sedang menghubungkan ke WhatsApp...
        </p>
      </div>
    </div>
  );
}
