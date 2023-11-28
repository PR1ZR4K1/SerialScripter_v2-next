import { prisma } from '@/lib/prisma';

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const hosts = await prisma.host.findMany();

  return NextResponse.json(hosts);
}
