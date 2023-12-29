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
        userAccounts: true,
        os: true,
        networkServices: true,
        systemServices: true,
        systemInfo: true,
        disks: true,
        connections: true,
        shares: true,
        firewallRules: true,
        containers: {
          include: {
            containerVolumes: true,
            containerNetworks: true,
          }
        },
      }
  });

  return NextResponse.json({ now: formatTimestampToPST(Date.now()), host})
  
  // return NextResponse.json(hosts);
}
