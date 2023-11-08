import { headers } from 'next/headers';
import { whitelist } from '../vars';
import { validateIPAddress } from '../../utils/validate';


export async function POST(req: Request) {
  const { ipAddress } = await req.json();

  if (validateIPAddress(ipAddress)) {
    whitelist.push(ipAddress);
    return Response.json(
      { whitelist_list: whitelist },
      { status: 200, statusText: 'OK' }
    );
  } else {
    return Response.json(
      { error: 'Invalid IP address format' },
      { status: 400, statusText: 'Bad Request' }
    );
  }
}
