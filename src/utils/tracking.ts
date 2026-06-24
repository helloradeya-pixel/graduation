import { getSegment } from './getSegment';

type TrackLabel = string;

const isBrowser = () => typeof window !== 'undefined';

// Helper: Membuat ID unik untuk deduplikasi Meta
export const generateEventId = () => {
  return `${getSegment()}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Helper: Ambil FBC (Facebook Click ID) dari cookie
const getFbc = () => {
  if (!isBrowser()) return undefined;
  const match = document.cookie.match(/_fbc=([^;]+)/);
  return match ? match[1] : undefined;
};

const getBasePayload = () => ({
  segment: getSegment(),
});

// =========================
// META PIXEL WRAPPER (UPDATED)
// =========================
const metaTrack = (event: string, event_id: string, params?: any, userData?: any) => {
  if (!isBrowser()) return;

  // Menggabungkan user data yang dikirim dengan fbc dari cookie
  const finalUserData = {
    ...userData,
    fbc: getFbc(), // Otomatis disisipkan ke setiap event
  };

  const payload = {
    ...getBasePayload(),
    ...params,
    user_data: finalUserData,
  };

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
// WHATSAPP CLICK
// =========================
export const trackWA = (label: TrackLabel = 'unknown', extra?: Record<string, any>, wa?: string) => {
  const segment = getSegment();
  const event_id = generateEventId();
  const userData = wa ? { ph: wa } : {};

  metaTrack('Contact', event_id, {
    content_name: `WA_${segment}_${label}`,
    segment,
    ...extra,
  }, userData);

  gaTrack('click_whatsapp', { event_label: label, segment, ...extra });
};

// =========================
// LEAD FORM
// =========================
export const trackLead = (label: TrackLabel = 'form_submit', extra?: Record<string, any>, wa?: string) => {
  const segment = getSegment();
  const event_id = generateEventId();
  const userData = wa ? { ph: wa } : {};

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
