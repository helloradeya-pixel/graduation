import Head from 'next/head';
import { AppConfig } from '../utils/AppConfig';
import RadeyaphotoPage from "../templates/Home/home";

export default function Links() {
  return (
    <>
      <Head>
        <title>Link Bio | {AppConfig.site_name}</title>
        <meta name="description" content={`Hubungi kami untuk layanan fotografi di ${AppConfig.site_name}.`} />
      </Head>
      <RadeyaphotoPage />
    </>
  );
}
