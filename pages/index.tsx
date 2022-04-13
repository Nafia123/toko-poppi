import Head from 'next/head';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import Link from 'next/link';
import Header from '../components/02-molecules/Header';
import Footer from '../components/02-molecules/Footer';

export default function Home() {
  const { t } = useTranslation('frontpage');
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
        <div className="grid grid-cols-4 mt-20 md:mt-0">
          <div className="col-span-4 md:col-start-1 md:col-span-2 lg:col-start-2 lg:col-span-1 md:mt-56 flex px-10 md:px-5 h-64 md:h-screen">
            <div>
              <p className="text-5xl text-center font-bold text-gray-600 my-auto col-span-2">
                {t('frontPage.shopDescription')}
              </p>
              <p className="text-3xl md:mt-4 col-span-4 text-center font-bold text-gray-400 my-auto">
                {t('frontPage.menuDescription')}
              </p>
              <button type="button" className="mt-5 text-white w-full mx-5 ml-auto bg-blue-600 hover:bg-blue-700 border-blue-600 md:min-w-full disabled:bg-blue-300 disabled:border-blue-300 p-2">
                <Link href="/toko-shop">
                  {t('frontPage.orderButton')}
                </Link>
              </button>
            </div>
          </div>
          <div className="col-span-4 md:col-span-2 px-5 mt-40 md:h-screen md:py-20 md:px-10">
            <Image
              src="/store-hero-image.jpeg"
              className="my-auto rounded-bl-[100px] rounded-tr-[100px] rounded-tl-3xl rounded-br-3xl"
              width={531}
              height={708}
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
