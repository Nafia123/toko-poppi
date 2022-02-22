import { NextApiRequest, NextApiResponse } from 'next';
import { gql } from '@apollo/client';
import client from '../../apollo-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { recordId, payment_intent } = req.body;
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
  return client.mutate({ mutation })
    .then((response) => res.status(200).json(response)).catch((e) => {
      res.status(500).json(e);
    });
}
