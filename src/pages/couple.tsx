import Head from 'next/head';
import { Couple } from '../templates/couple/couple';

const CouplePage = () => {
  return (
    <>
      <Head>
        <title>Fotografi Couple | Radeyaphoto</title>
        <meta name="description" content="Jasa fotografi couple profesional dengan sentuhan estetik dan timeless oleh Radeyaphoto." />
      </Head>
      <Couple />
    </>
  );
};

export default CouplePage;
