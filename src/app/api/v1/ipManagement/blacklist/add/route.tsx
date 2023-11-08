import { headers } from 'next/headers';
import { validateIPAddress } from '../../utils/validate';
import { blacklist } from '../vars';



export async function POST(req: Request) {
  const { ipAddress } = await req.json();

  if (validateIPAddress(ipAddress)) {
    blacklist.push(ipAddress);
    return Response.json(
      { blacklist_list: blacklist },
      { status: 200, statusText: 'OK' }
    );
  } else {
    return Response.json(
      { error: 'Invalid IP address format' },
      { status: 400, statusText: 'Bad Request' }
    );
  }
}
