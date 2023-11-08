import { blacklist } from '../vars';

export async function GET(req: Request) {
  return Response.json(blacklist, { status: 200, statusText: 'OK' });
}
