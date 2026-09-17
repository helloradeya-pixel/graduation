import { getSegment } from './getSegment';

type TrackLabel = string;
const isBrowser = () => typeof window !== 'undefined';

// Helper: Generator Event ID unik untuk deduplikasi Meta Pixel & CAPI
export const generateEventId = () => {
  return `${getSegment()}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

const getBasePayload = () => ({
  segment: getSegment(),
});

// =========================
// META PIXEL WRAPPER
// =========================
const metaTrack = (event: string, event_id: string, params?: any) => {
  if (!isBrowser()) return;

  const payload = {
    ...getBasePayload(),
    ...params,
  };

  // Parameter 1: Event Type ('track')
  // Parameter 2: Event Name ('Lead' / 'Contact')
  // Parameter 3: Custom Data Payload
  // Parameter 4: Option Object berisi eventID untuk deduplikasi CAPI
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
export const trackWA = (label: TrackLabel = 'unknown', extra?: Record<string, any>) => {
  const segment = getSegment();
  const event_id = generateEventId();

  metaTrack('Contact', event_id, {
    content_name: `WA_${segment}_${label}`,
    segment,
    ...extra,
  });

  gaTrack('click_whatsapp', { event_label: label, segment, ...extra });

  return event_id;
};

// =========================
// KONVERSI: LEAD FORM
// =========================
export const trackLead = (label: TrackLabel = 'form_submit', extra?: Record<string, any>) => {
  const segment = getSegment();
  const event_id = generateEventId();

  metaTrack('Lead', event_id, {
    content_name: `Lead_${segment}_${label}`,
    segment,
    ...extra,
  });

  gaTrack('generate_lead', { event_label: label, segment, ...extra });
  
  return event_id;
};

// =========================
// PAGE VIEW (GA4 ONLY)
// =========================
export const trackGraduationView = () => {
  if (!isBrowser()) return;
  gaTrack('view_graduation_page', { segment: 'graduation' });
};

export const trackCoupleView = () => {
  if (!isBrowser()) return;
  gaTrack('view_couple_page', { segment: 'couple' });
};
