import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const windowsHosts = await prisma.host.findMany({
    where: {
      os: 'Windows'
    }
  });

  console.log(windowsHosts)
  return NextResponse.json(windowsHosts);
}
