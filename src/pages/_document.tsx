import Document, { Head, Html, Main, NextScript } from 'next/document';
import { AppConfig } from '../utils/AppConfig';

class MyDocument extends Document {
  render() {
    return (
      <Html lang={AppConfig.locale}>
        <Head>

          {/* =========================
              META PIXEL
          ========================= */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;
                n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);
                t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}
                (window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');

                fbq('init', '804715912719122');
                fbq('track', 'PageView');
              `,
            }}
          />

          {/* =========================
              GOOGLE ANALYTICS (GA4)
          ========================= */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-JLNW7X43JF"
          />

          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;

                gtag('js', new Date());

                gtag('config', 'G-JLNW7X43JF', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />

        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
