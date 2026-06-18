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
// WHATSAPP CLICK (BOF EVENT)
// =========================
export const trackWA = (
  label: TrackLabel = 'unknown',
  extra?: Record<string, any>,
) => {
  const segment = getSegment();

  // GLOBAL WA CLICK (ALL TRAFFIC)
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

  // SEGMENTED EVENTS (FOR ADS OPTIMIZATION)
  if (segment === 'graduation') {
    metaTrackCustom('ClickWhatsApp_Graduation', {
      content_name: `WA_graduation_${label}`,
      ...extra,
    });
  }

  if (segment === 'couple') {
    metaTrackCustom('ClickWhatsApp_Couple', {
      content_name: `WA_couple_${label}`,
      ...extra,
    });
  }
};

// =========================
// PRICELIST CLICK (MOF EVENT)
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
// LEAD FORM (MOF EVENT)
// =========================
export const trackLead = (
  label: TrackLabel = 'form_submit',
  extra?: Record<string, any>,
) => {
  const segment = getSegment();

  // GLOBAL LEAD
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

  // SEGMENTED LEADS (FOR ADS OPTIMIZATION)
  if (segment === 'graduation') {
    metaTrackCustom('Lead_Graduation', {
      content_name: `Lead_graduation_${label}`,
      ...extra,
    });
  }

  if (segment === 'couple') {
    metaTrackCustom('Lead_Couple', {
      content_name: `Lead_couple_${label}`,
      ...extra,
    });
  }
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
