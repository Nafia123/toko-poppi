import Head from 'next/head';

import { DateTime } from 'luxon';
import { gql } from '@apollo/client';
import Header from '../../components/02-molecules/Header';
import client from '../../apollo-client';
import { ShoppingCartItem } from '../../_types/ShoppingCartItem';

interface GqlData{
  orders: {
    data: Array<OrderData>
  }
}

interface OrderData{
  attributes: {
    deliveryTime: DateTime,
    paymentAmount: number,
    orderNumber: string,
    createdAt: DateTime,
    orderContent: Array<ShoppingCartItem>,
    customerInformation: {
      email: string
      fullName: string
    },
  }
}

export async function getStaticProps() {
  const today = DateTime.now();
  const startTime = today.set({ hour: 0, minute: 0 });
  const endTime = today.set({ hour: 23, minute: 59 });
  const query = gql`
     query  { 
 orders(filters:{deliveryTime:{gte:"${startTime.toString()}", lte:"${endTime.toString()}"}, paymentFulfilled:{eq:true}}){
    data{
      attributes{
        deliveryTime
        paymentAmount
        orderContent
        orderNumber
        createdAt
        customerInformation{
          email
          fullName
        }
      }
    }
  }
} `;

  const { data } = await client.query<GqlData>({ query });
  return {
    props: {
      orders: data.orders,
    },
  };
}

export default function Dashboard({ orders: { data } } : GqlData) {
  return (
    <div>
      <Head>
        <title>Dasboard</title>
        <link rel="icon" href="toko-poppi-logo.png" />
      </Head>
      <Header />
      <section className="p-4">
        <p className="text-4xl mb-4">Bestellingen</p>
        <div className="border-gray-200 text-xl font-bold border-b flex justify-between grid grid-cols-5">
          <p>Email</p>
          <p>Naam</p>
          <p>Bestellingnummer</p>
          <p>Bestelling</p>
          <p>BezorgTijd</p>
        </div>
        { data.length === 0 ? <p>Geen bestellingen</p> : (
          data.map(({ attributes }) => (
            <div className="border-gray-200 text-xl border drop-shadow justify-between flex grid grid-cols-5" key={attributes.orderNumber}>
              <p className="">{attributes.customerInformation.email}</p>
              <p className="">{attributes.customerInformation.fullName}</p>
              <p className="">{attributes.orderNumber}</p>
              {attributes.orderContent.map(({
                amount, name, id, option,
              }) => (
                <div key={id} className="flex">
                  <p className="">
                    {amount}
                    x
                  </p>
                  <p className="ml-2">{name}</p>
                  <div className="ml-2">
                    {option.map((opt) => <p>{opt}</p>)}
                  </div>
                </div>
              ))}
              <p className="">{DateTime.fromISO(attributes.deliveryTime.toString()).toFormat('HH:mm (ccc dd MMM)')}</p>
            </div>
          )))}
      </section>
    </div>
  );
}
