import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for secret to confirm this is a valid request
  if (req.headers.secret !== 'test') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    if (req.body.model === 'order') await res.unstable_revalidate('/dashboard');
    await res.unstable_revalidate('/pall');
    await res.unstable_revalidate('/nl-NL/pall');
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
}
