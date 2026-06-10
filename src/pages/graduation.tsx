import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Base } from '../templates/Base';

export default function Graduation() {
  const router = useRouter();

  // TRACK SOURCE (TikTok / IG / direct)
  useEffect(() => {
    if (!router.isReady) return;

    const source = router.query.source || 'direct';

    // GA4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'traffic_source', {
        source: String(source),
        page: 'graduation',
      });
    }

    // META PIXEL
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('trackCustom', 'TrafficSource', {
        source: String(source),
      });
    }
  }, [router.isReady]);

  return <Base />;
}
