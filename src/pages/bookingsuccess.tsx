import { useEffect } from 'react';

export default function BookingSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const service = params.get('service');
    const nama = params.get('nama') || '';
    const paket = params.get('package') || '';
    const tanggal = params.get('tanggal') || '';
    const jamMulai = params.get('jam_mulai') || '';
    const jamSelesai = params.get('jam_selesai') || '';
    const dp = params.get('dp') || '';

    const value = Number(dp || 0);

    // =========================
    // UNIQUE EVENT ID (DEDUP KEY)
    // =========================
    const eventId = `${service}_${Date.now()}`;

    // =========================
    // META PIXEL
    // =========================
    const fireMetaEvent = () => {
      const eventName =
        service === 'graduation'
          ? 'CompleteRegistration_Graduation'
          : service === 'couple'
          ? 'CompleteRegistration_Couple'
          : 'CompleteRegistration';

      window.fbq?.(
        'trackCustom',
        eventName,
        {
          service,
          value,
          currency: 'IDR',
        },
        {
          eventID: eventId,
        }
      );

      console.log('PIXEL FIRED:', {
        eventName,
        eventId,
        value,
      });
    };

    // =========================
    // GA4 EVENT
    // =========================
    const fireGA4 = () => {
      window.gtag?.('event', 'generate_lead', {
        event_category: 'booking',
        event_label: service,
        value,
      });
    };

    // =========================
    // META CAPI (Vercel API)
    // =========================
    const fireCAPI = async () => {
      try {
        await fetch('/api/meta-capi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_name:
              service === 'graduation'
                ? 'CompleteRegistration_Graduation'
                : service === 'couple'
                ? 'CompleteRegistration_Couple'
                : 'CompleteRegistration',
            event_id: eventId,
            value,
            service,
          }),
        });
      } catch (err) {
        console.log('CAPI ERROR:', err);
      }
    };

    // =========================
    // WHATSAPP MESSAGE
    // =========================
    let message = '';

    if (service === 'graduation') {
      message = `Halo kak, sudah booking Graduation atas nama ${nama}
Package: ${paket}
Tanggal: ${tanggal}
Jam: ${jamMulai} - ${jamSelesai}
DP: ${dp}`;
    }

    if (service === 'couple') {
      message = `Halo kak, sudah booking Couple atas nama ${nama}
DP: ${dp}`;
    }

    const waLink = `https://wa.me/628211251570?text=${encodeURIComponent(message)}`;

    // =========================
    // EXECUTION ORDER
    // =========================
    fireMetaEvent();
    fireGA4();
    fireCAPI();

    const timer = setTimeout(() => {
      window.location.href = waLink;
    }, 4500);

    return () => clearTimeout(timer);
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
