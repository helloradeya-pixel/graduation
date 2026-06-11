import { getSegment } from './getSegment';

type TrackLabel = string;

const isBrowser = () => typeof window !== 'undefined';

const getBasePayload = () => {
  const segment = getSegment();

  return {
    segment,
  };
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
export const trackWA = (
  label: TrackLabel = 'unknown',
  extra?: Record<string, any>,
) => {
  metaTrack('Contact', {
    content_name: `WA_${label}`,
    ...extra,
  });

  gaTrack('click_whatsapp', {
    event_label: label,
    ...extra,
  });
};

// =========================
// PRICELIST CLICK
// =========================
export const trackPricelist = (
  label: TrackLabel = 'unknown',
  extra?: Record<string, any>,
) => {
  metaTrack('ViewContent', {
    content_name: `Pricelist_${label}`,
    ...extra,
  });

  gaTrack('click_pricelist', {
    event_label: label,
    ...extra,
  });
};

// =========================
// LEAD FORM SUBMIT
// =========================
export const trackLead = (
  label: TrackLabel = 'form_submit',
  extra?: Record<string, any>,
) => {
  metaTrack('Lead', {
    content_name: `Lead_${label}`,
    ...extra,
  });

  gaTrack('generate_lead', {
    event_label: label,
    ...extra,
  });
};
