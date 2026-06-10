import { getSegment } from './getSegment';

type TrackLabel = string;

const isBrowser = () => typeof window !== 'undefined';

const getBasePayload = () => {
  const segment = getSegment();
  return { segment };
};

// =========================
// META PIXEL WRAPPER
// =========================
const metaTrack = (event: string, params?: any) => {
  if (!isBrowser()) return;

  window.fbq?.('track', event, {
    ...getBasePayload(),
    ...params,
  });
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
export const trackWA = (label: TrackLabel = 'unknown') => {
  metaTrack('Contact', {
    content_name: `WA_${label}`,
  });

  gaTrack('click_whatsapp', {
    event_label: label,
  });
};

// =========================
// PRICELIST CLICK
// =========================
export const trackPricelist = (label: TrackLabel = 'unknown') => {
  metaTrack('ViewContent', {
    content_name: `Pricelist_${label}`,
  });

  gaTrack('click_pricelist', {
    event_label: label,
  });
};

// =========================
// LEAD FORM SUBMIT
// =========================
export const trackLead = (label: TrackLabel = 'form_submit', extra?: any) => {
  metaTrack('Lead', {
    content_name: `Lead_${label}`,
    ...extra,
  });

  gaTrack('generate_lead', {
    event_label: label,
  });
};
