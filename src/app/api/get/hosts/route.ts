import { hash } from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { Host } from '@prisma/client';

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const hosts = await prisma.host.findMany();

  return NextResponse.json(hosts);
}
