import { headers } from 'next/headers';

export async function GET(request: Request) {

  return Response.json(
    { my: "data" },
    { status: 200, statusText: "OK" },
);
}
