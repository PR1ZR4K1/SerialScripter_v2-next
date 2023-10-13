import { headers } from 'next/headers';
import { whitelist } from '../vars';

export async function GET(req: Request) {
  // res.json({ whitelist });

  return Response.json(whitelist, { status: 200, statusText: 'OK' });
}
