import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { AppConfig } from '../utils/AppConfig';

type IMetaProps = {
  title: string;
  description: string;
  canonical?: string;
  addPixelId?: string;
};

const Meta = (props: IMetaProps) => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" key="charset" />
        <meta name="viewport" content="width=device-width,initial-scale=1" key="viewport" />

        {/* META PIXEL - PUSAT KENDALI (DUAL TRACKING) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');

              // Inisialisasi Pixel Lama
              fbq('init', '804715912719122');
              fbq('track', 'PageView');

              // Inisialisasi Pixel Baru (Jika ID tersedia)
              ${props.addPixelId ? `fbq('init', '${props.addPixelId}'); fbq('track', 'PageView');` : ''}
            `,
          }}
        />
        <noscript>
          <img height="1" width="1" style={{display: 'none'}}
            src="https://www.facebook.com/tr?id=804715912719122&ev=PageView&noscript=1"
          />
          {props.addPixelId && (
            <img height="1" width="1" style={{display: 'none'}}
              src={"https://www.facebook.com/tr?id=" + props.addPixelId + "&ev=PageView&noscript=1"}
            />
          )}
        </noscript>
      </Head>

      <NextSeo
        title={props.title}
        description={props.description}
        canonical={props.canonical}
        openGraph={{
          title: props.title,
          description: props.description,
          url: props.canonical,
          locale: AppConfig.locale,
          site_name: AppConfig.site_name,
        }}
      />
    </>
  );
};

export { Meta };
