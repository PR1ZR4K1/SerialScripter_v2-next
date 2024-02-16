import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const revalidate = 1;
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const windowsHosts = await prisma.host.findMany({
    where: {
        os: 'windows'
    },
  });

  return NextResponse.json(windowsHosts);
}
