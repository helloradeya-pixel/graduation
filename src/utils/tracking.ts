import { getSegment } from './getSegment';

type TrackLabel = string;

const isBrowser = () => typeof window !== 'undefined';

const getBasePayload = () => ({
  segment: getSegment(),
});

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

const metaTrackCustom = (event: string, params?: any) => {
  if (!isBrowser()) return;

  window.fbq?.('trackCustom', event, {
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
// WHATSAPP CLICK (IMPORTANT)
// =========================
export const trackWA = (
  label: TrackLabel = 'unknown',
  extra?: Record<string, any>,
) => {
  const segment = getSegment();

  metaTrackCustom('ClickWhatsApp', {
    content_name: `WA_${segment}_${label}`,
    segment,
    ...extra,
  });

  gaTrack('click_whatsapp', {
    event_label: label,
    segment,
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
  const segment = getSegment();

  metaTrack('ViewContent', {
    content_name: `Pricelist_${segment}_${label}`,
    segment,
    ...extra,
  });

  gaTrack('click_pricelist', {
    event_label: label,
    segment,
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
  const segment = getSegment();

  metaTrack('Lead', {
    content_name: `Lead_${segment}_${label}`,
    segment,
    ...extra,
  });

  gaTrack('generate_lead', {
    event_label: label,
    segment,
    ...extra,
  });
};

// =========================
// PAGE VIEW - GRADUATION
// =========================
export const trackGraduationView = () => {
  if (!isBrowser()) return;

  metaTrackCustom('ViewGraduationPage', {
    segment: 'graduation',
  });

  gaTrack('view_graduation_page', {
    segment: 'graduation',
  });
};

// =========================
// PAGE VIEW - COUPLE
// =========================
export const trackCoupleView = () => {
  if (!isBrowser()) return;

  metaTrackCustom('ViewCouplePage', {
    segment: 'couple',
  });

  gaTrack('view_couple_page', {
    segment: 'couple',
  });
};
