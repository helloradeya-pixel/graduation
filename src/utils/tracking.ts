import { getSegment } from './getSegment';

type TrackLabel = string;

const isBrowser = () => typeof window !== 'undefined';

// Helper: Membuat ID unik untuk deduplikasi Meta
export const generateEventId = () => {
  return `${getSegment()}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

const getBasePayload = () => ({
  segment: getSegment(),
});

// =========================
// META PIXEL WRAPPER (UPDATED)
// =========================
// Menambahkan parameter user_data untuk Advanced Matching (hashing otomatis oleh Meta Pixel)
const metaTrack = (event: string, event_id: string, params?: any, userData?: any) => {
  if (!isBrowser()) return;

  const payload = {
    ...getBasePayload(),
    ...params,
  };

  // Jika ada userData (nomor WA), tambahkan ke event
  if (userData) {
    payload.user_data = userData;
  }

  window.fbq?.('track', event, payload, { eventID: event_id });
};

// =========================
// GA4 WRAPPER
// =========================
const gaTrack = (event: string, params?: any) => {
  if (!isBrowser()) return;
  window.gtag?.('event', event, {
    event_category: getSegment(),
    ...params,
  });
};

// =========================
// LEAD FORM (UPDATED)
// =========================
export const trackLead = (label: TrackLabel = 'form_submit', extra?: Record<string, any>, wa?: string) => {
  const segment = getSegment();
  const event_id = generateEventId();
  
  // Kirim nomor WA ke browser pixel untuk Advanced Matching
  const userData = wa ? { ph: wa } : undefined;

  metaTrack('Lead', event_id, {
    content_name: `Lead_${segment}_${label}`,
    segment,
    ...extra,
  }, userData);

  gaTrack('generate_lead', { event_label: label, segment, ...extra });
  
  return event_id;
};

// =========================
// PAGE VIEW
// =========================
export const trackGraduationView = () => {
  if (!isBrowser()) return;
  const event_id = generateEventId();
  
  metaTrack('ViewContent', event_id, { 
    content_name: 'Graduation Page',
    segment: 'graduation' 
  });
  
  gaTrack('view_graduation_page', { segment: 'graduation' });
};

export const trackCoupleView = () => {
  if (!isBrowser()) return;
  const event_id = generateEventId();
  
  metaTrack('ViewContent', event_id, { 
    content_name: 'Couple Page',
    segment: 'couple' 
  });
  
  gaTrack('view_couple_page', { segment: 'couple' });
};
