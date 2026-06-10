// tracking.ts

export const trackWA = (label = 'unknown') => {
  if (typeof window === 'undefined') return;

  // META PIXEL
  window.fbq?.('track', 'Contact', {
    content_name: `WA Click - ${label}`,
  });

  // GA4
  window.gtag?.('event', 'click_whatsapp', {
    event_category: 'whatsapp',
    event_label: label,
  });
};

export const trackPricelist = (label = 'unknown') => {
  if (typeof window === 'undefined') return;

  window.gtag?.('event', 'click_pricelist', {
    event_category: 'cta',
    event_label: label,
  });
};

export const trackLead = (label = 'form') => {
  if (typeof window === 'undefined') return;

  window.fbq?.('track', 'Lead', {
    content_name: label,
  });

  window.gtag?.('event', 'generate_lead', {
    event_category: 'lead',
    event_label: label,
  });
};
