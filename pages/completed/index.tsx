import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import useTranslation from 'next-translate/useTranslation';
import fetch from 'node-fetch';
import Header from '../../components/02-molecules/Header';
import { LoaderComplete, LoaderFailed } from '../../components/02-molecules/Loader';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);

export default function completed() {
  const [startAnimation, setStartAnimation] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [stripe, setStripe] = useState<Stripe>();
  const router = useRouter();
  const { t } = useTranslation('order');
  const { locale } = useRouter();
  useEffect(() => {
    const urlContainParams = window.location.search.length === 0;
    if (urlContainParams) window.location.href = '/';
    const getStripe = async () => {
      const stripeResponse = await stripePromise.then((data) => data);
      if (stripeResponse) {
        setStripe(stripeResponse);
      }
    };
    getStripe();
  }, []);
  useEffect(() => {
    const {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      payment_intent_client_secret, payment_intent, recordId, redirect_status,
    } = router.query;
    if (!stripe || !payment_intent_client_secret) {
      return;
    }
    if (redirect_status === 'failed') {
      setPaymentFailed(redirect_status === 'failed');
      setStartAnimation(true);
      return;
    }

    stripe!.confirmCardPayment(payment_intent_client_secret as string)
      .then(({ paymentIntent }) => {
        if (paymentIntent && paymentIntent.status === 'succeeded') {
          fetch('/api/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ payment_intent, recordId, locale }),
          }).then(() => setStartAnimation(true));
        }
      }).catch((e) => {
        console.log(e);
      });
  }, [stripe]);
  return (
    <div>
      <Head>
        <title>Enjoy your meal</title>
        <link rel="icon" href="toko-poppi-logo.png" />

      </Head>
      <Header />
      <section>
        {paymentFailed ? (
          <div className="grid grid-cols-6 md:grid-cols-3">
            <div className="col-start-2 col-span-4 md:col-start-2 md:col-end-3 flex px-10 md:px-5  md:h-40 align-middle">
              <p className="text-5xl text-center font-bold text-gray-600 my-auto">
                <LoaderFailed completeLoader={startAnimation} />
                <p className="transition-opacity">{startAnimation ? t('completeOrder.failMessage') : ''}</p>
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-6 md:grid-cols-3">
            <div className="col-start-2 col-span-4 md:col-start-2 md:col-end-3 flex px-10 md:px-5  md:h-40 align-middle">
              <p className="text-5xl text-center font-bold text-gray-600 my-auto">
                <LoaderComplete completeLoader={startAnimation} />
                <p className="transition-opacity">{startAnimation ? t('completeOrder.confirmationMessage') : ''}</p>
              </p>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
