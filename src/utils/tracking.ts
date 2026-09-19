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

// Helper: Ambil Cookie Pelacak Meta (_fbp & _fbc)
const getCookie = (name: string) => {
  if (!isBrowser()) return '';
  return document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))?.split('=')[1] || '';
};

// Helper: Tembak Event ke API Handler CAPI Next.js kamu
const sendCapi = (
  event_id: string,
  label: string,
  eventType: 'inquiry' | 'booking' = 'inquiry',
  extraUserData?: any,
  customData?: any
) => {
  if (!isBrowser()) return;

  fetch('/api/meta-capi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_id,
      type: eventType, // 'inquiry' otomatis diubah API handler menjadi event 'Lead'
      segment: getSegment(),
      service: label,
      url: window.location.href,
      user_data: {
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc'),
        ...extraUserData,
      },
      ...customData, // campus & month dikirim ke tingkat utama payload
    }),
  }).catch((err) => console.error('CAPI Error:', err));
};

// =========================
// META PIXEL WRAPPER
// =========================
const metaTrack = (event: string, event_id: string, params?: any) => {
  if (!isBrowser()) return;

  const payload = {
    ...getBasePayload(),
    ...params,
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
// KONVERSI: WHATSAPP CLICK
// =========================
export const trackWA = (label: TrackLabel = 'unknown', extra?: Record<string, any>) => {
  const segment = getSegment();
  const event_id = generateEventId();
  const labelName = `WA_${segment}_${label}`;

  // 1. Meta Pixel (Browser) -> Mengirim 'Lead'
  metaTrack('Lead', event_id, {
    content_name: labelName,
    segment,
    ...extra,
  });

  // 2. Meta CAPI (Server) -> Tembak API Route Next.js
  sendCapi(event_id, labelName, 'inquiry');

  // 3. Google Analytics 4
  gaTrack('click_whatsapp', { event_label: label, segment, ...extra });

  return event_id;
};

// =========================
// KONVERSI: LEAD FORM
// =========================
export const trackLead = (
  label: TrackLabel = 'form_submit',
  userData?: { ph?: string; em?: string; fn?: string; ln?: string; campus?: string; month?: string; [key: string]: any },
  extra?: Record<string, any>
) => {
  const segment = getSegment();
  const event_id = generateEventId();
  const labelName = `Lead_${segment}_${label}`;

  // Pisahkan identitas user (ph, em, fn, ln) dan custom parameter (campus, month)
  const { ph, em, fn, ln, campus, month, ...restUserData } = userData || {};

  const userIdentity = { ph, em, fn, ln };
  const customParams = {
    content_name: labelName,
    segment,
    campus,
    month,
    ...restUserData,
    ...extra,
  };

  // 1. Meta Pixel (Browser) -> Mengirim 'Lead' + Custom Parameters (campus & month)
  metaTrack('Lead', event_id, customParams);

  // 2. Meta CAPI (Server) -> Mengirim identitas ke user_data & parameter bisnis ke customData
  sendCapi(event_id, labelName, 'inquiry', userIdentity, customParams);

  // 3. Google Analytics 4
  gaTrack('generate_lead', { event_label: label, segment, ...customParams });

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
