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
// META PIXEL WRAPPER
// =========================
const metaTrack = (event: string, event_id: string, params?: any) => {
  if (!isBrowser()) return;

  window.fbq?.('track', event, {
    ...getBasePayload(),
    ...params,
  }, { eventID: event_id });
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
// WHATSAPP CLICK
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
};

// =========================
// LEAD FORM
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
// PAGE VIEW (UPDATED UNTUK MENGHILANGKAN ERROR)
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
