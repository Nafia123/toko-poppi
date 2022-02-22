import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { gql } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import Header from '../../components/02-molecules/Header';
import client from '../../apollo-client';
import { LoaderComplete } from '../../components/02-molecules/Loader';

const stripePromise = loadStripe('pk_test_51KMTBGFtTMP6ObZTa6yq443X9giUn0dBYyUwEsLRqXoOXk1XzKfmME7mu8vkBgywoS14oFnXzeEycJ3Ql1JmBuIz003kGrDWaF');

export default function completed() {
  const [startAnimation, setStartAnimation] = useState(false);
  const [stripe, setStripe] = useState<Stripe>();
  const router = useRouter();
  const { t } = useTranslation('order');

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
      payment_intent_client_secret, payment_intent, recordId,
    } = router.query;

    if (!stripe || !payment_intent_client_secret) {
      return;
    }
    stripe!.confirmCardPayment(payment_intent_client_secret as string)
      .then(({ paymentIntent }) => {
        if (paymentIntent && paymentIntent.status === 'succeeded') {
          const mutation = gql`
              mutation {
               updateOrder(
                   id: ${recordId}
                   data: {
                     paymentFulfilled: true
                     stripePaymentId: "${payment_intent}"
                   }
               ) {
                 data {
                  attributes {
                   paymentFulfilled
                   stripePaymentId
                 }
               }
             }
            }`;
          client.mutate({ mutation }).then(() => {
            setStartAnimation(true);
          }).catch((e) => {
            console.log(e);
          });
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
        <div className="grid grid-cols-6 md:grid-cols-3">
          <div className="col-start-2 col-span-4 md:col-start-2 md:col-end-3 flex px-10 md:px-5  md:h-40 align-middle">
            <p className="text-5xl text-center font-bold text-gray-600 my-auto">
              <LoaderComplete completeLoader={startAnimation} />
              {t('completeOrder.confirmationMessage')}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
