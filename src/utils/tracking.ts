// src/utils/tracking.ts
import { getSegment } from './getSegment';

const safeWindow = () => typeof window !== 'undefined';

export const trackWA = (label = 'unknown') => {
  if (!safeWindow()) return;

  const segment = getSegment();

  window.fbq?.('track', 'Contact', {
    content_name: `WA Click - ${label}`,
    content_category: segment,
  });

  window.gtag?.('event', 'click_whatsapp', {
    event_category: segment,
    event_label: label,
  });
};

export const trackPricelist = (label = 'unknown') => {
  if (!safeWindow()) return;

  const segment = getSegment();

  window.fbq?.('track', 'ViewContent', {
    content_name: `Pricelist - ${label}`,
    content_category: segment,
  });

  window.gtag?.('event', 'click_pricelist', {
    event_category: segment,
    event_label: label,
  });
};

export const trackLead = (label = 'form') => {
  if (!safeWindow()) return;

  const segment = getSegment();

  window.fbq?.('track', 'Lead', {
    content_name: label,
    content_category: segment,
  });

  window.gtag?.('event', 'generate_lead', {
    event_category: segment,
    event_label: label,
  });
};

export const trackPageView = (label = 'page') => {
  if (!safeWindow()) return;

  const segment = getSegment();

  window.fbq?.('track', 'PageView', {
    content_category: segment,
    content_name: label,
  });

  window.gtag?.('event', 'page_view_custom', {
    event_category: segment,
    event_label: label,
  });
};
