import { NextApiRequest, NextApiResponse } from 'next';
import { gql } from '@apollo/client';
import client from '../../apollo-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { recordId, payment_intent, locale } = req.body;
  if (!recordId || !payment_intent) {
    return res.status(400);
  }
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
                   orderNumber
                   orderContent
                   paymentAmount
                   customerInformation{
                      fullName
                      email
                   }
                 }
               }
             }
            }`;
  return client.mutate({ mutation })
    .then((response) => {
      const { updateOrder: { data: { attributes } } } = response.data;
      fetch(`${process.env.STRAPI_LOCATION}/api/orders/mail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_AUTH_TOKEN}`,
        },
        body: JSON.stringify({ attributes, locale }),
      }).then((emailResponse) => {
        res.status(200).json({ response, ...emailResponse });
      });
    }).catch((e) => {
      res.status(500).json(e);
    });
}
