import Head from 'next/head';
import Image from 'next/image';
import Header from '../components/03-organisms/Header';

export default function Home() {
  return (
    <div>
      <Head>
        <title>We are under construction</title>
        <meta name="description" content="Webshop for the local Asian Shop called Toko Poppi" />
        <meta name="keywords" content="Webshop, Indian Food, Asian Food, Asian Products, Toko, Meals, Maaltijden" />
        <link rel="icon" href="toko-poppi-logo.png" />
      </Head>
      <Header />
      <section>
        <div className="grid grid-cols-4">
          <div className="col-span-4 sm:col-span-2 flex px-10 sm:px-5 h-64 sm:h-screen">
            <p className="text-5xl text-center font-bold text-gray-600 my-auto">
              Authentiek
              <span className="text-blue-500"> Indiaas </span>
              {' '}
              &
              <span className="text-blue-500"> Thaise </span>
              {' '}
              etenswaren
            </p>
          </div>
          <div className="col-span-4 sm:col-span-2 px-5 flex sm:h-screen sm:py-20 sm:px-10">
            <Image
              src="/store-hero-image.jpeg"
              className="my-auto rounded-bl-[100px] rounded-tr-[100px] rounded-tl-3xl rounded-br-3xl"
              width={531}
              height={708}
            />
          </div>
        </div>
      </section>

    </div>
  );
}
