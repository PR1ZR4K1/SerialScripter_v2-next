import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const revalidate = 1;


export async function GET(req: Request) {
  const windowsHosts = await prisma.host.findMany({
    where: {
      os: 'Windows'
    }
  });

  // console.log(windowsHosts)
  return NextResponse.json(windowsHosts);
}
