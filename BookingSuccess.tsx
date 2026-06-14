import { useEffect } from 'react';

export default function BookingSuccess() {
  useEffect(() => {
    const service =
      new URLSearchParams(window.location.search)
        .get('service');

    console.log('Booking Success:', service);
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
