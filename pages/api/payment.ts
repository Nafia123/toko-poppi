import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return fetch(`${process.env.STRAPI_LOCATION}/api/orders/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.STRAPI_AUTH_TOKEN}`,
    },
    body: JSON.stringify(req.body),
  }).then((response) => response.json()).then((parsed) => res.status(200).json(parsed));
}
