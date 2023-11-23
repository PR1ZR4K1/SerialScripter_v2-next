import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const linuxHosts = await prisma.host.findMany({
    where: {
      os: 'Linux'
    }
  });

  return NextResponse.json(linuxHosts);
}
