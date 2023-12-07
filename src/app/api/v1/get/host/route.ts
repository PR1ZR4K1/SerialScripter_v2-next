import { prisma } from '@/lib/prisma';

import { NextResponse } from 'next/server';
import { formatTimestampToPST } from '@/lib/formatTime';
// import { revalidatePath } from 'next/cache'
export const revalidate = 10;

export async function POST(req: Request) {

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed!' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

  const { hostname } = await req.json();

  const host = await prisma.host.findUnique({
      where: {
        hostname: hostname,
      },
      include: {
        os: true,
        networkServices: true,
      }
  });

  return NextResponse.json({ now: formatTimestampToPST(Date.now()), host})
  
  // return NextResponse.json(hosts);
}
