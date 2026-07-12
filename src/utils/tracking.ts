import { getSegment } from './getSegment';

type TrackLabel = string;
const isBrowser = () => typeof window !== 'undefined';

// Helper: Membuat ID unik untuk deduplikasi Meta (Penting untuk CAPI/Pixel)
export const generateEventId = () => {
  return `${getSegment()}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Helper: Ambil FBC (Facebook Click ID) dari cookie untuk akurasi pelacakan
const getFbc = () => {
  if (!isBrowser()) return undefined;
  const match = document.cookie.match(/_fbc=([^;]+)/);
  return match ? match[1] : undefined;
};

const getBasePayload = () => ({
  segment: getSegment(),
});

// =========================
// META PIXEL WRAPPER
// =========================
const metaTrack = (event: string, event_id: string, params?: any, userData?: any) => {
  if (!isBrowser()) return;

  const finalUserData = {
    ...userData,
    fbc: getFbc(),
  };

  const payload = {
    ...getBasePayload(),
    ...params,
    user_data: finalUserData,
  };

  // Menggunakan trackSingle agar tidak bentrok jika ada 2 pixel
  window.fbq?.('track', event, payload, { eventID: event_id });
};

// =========================
// GA4 WRAPPER
// =========================
export const gaTrack = (event: string, params?: any) => {
  if (!isBrowser()) return;
  window.gtag?.('event', event, {
    event_category: getSegment(),
    ...params,
  });
};

// =========================
// KONVERSI: WHATSAPP CLICK
// =========================
export const trackWA = (label: TrackLabel = 'unknown', extra?: Record<string, any>, wa?: string) => {
  const segment = getSegment();
  const event_id = generateEventId();
  const userData = wa ? { ph: wa } : {};

  metaTrack('Contact', event_id, {
    content_name: `WA_${segment}_${label}`,
    segment, // Segmentasi tetap dikirim ke Meta
    ...extra,
  }, userData);

  gaTrack('click_whatsapp', { event_label: label, segment, ...extra });
};

// =========================
// KONVERSI: LEAD FORM
// =========================
export const trackLead = (label: TrackLabel = 'form_submit', extra?: Record<string, any>, wa?: string) => {
  const segment = getSegment();
  const event_id = generateEventId();
  const userData = wa ? { ph: wa } : {};

  metaTrack('Lead', event_id, {
    content_name: `Lead_${segment}_${label}`,
    segment, // Segmentasi tetap dikirim ke Meta
    ...extra,
  }, userData);

  gaTrack('generate_lead', { event_label: label, segment, ...extra });
  
  return event_id;
};

// =========================
// PAGE VIEW (GA4 ONLY)
// Meta Pixel sudah handle otomatis melalui Meta.tsx
// =========================
export const trackGraduationView = () => {
  if (!isBrowser()) return;
  gaTrack('view_graduation_page', { segment: 'graduation' });
};

export const trackCoupleView = () => {
  if (!isBrowser()) return;
  gaTrack('view_couple_page', { segment: 'couple' });
};
