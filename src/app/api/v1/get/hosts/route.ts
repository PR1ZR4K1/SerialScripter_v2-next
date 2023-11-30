import { prisma } from '@/lib/prisma';

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'


export async function GET(req: Request) {

  const hosts = await prisma.host.findMany();
  
  revalidatePath('/');
  
  
  return NextResponse.json({ revalidated: true, now: Date.now(), data: hosts })
  
  // return NextResponse.json(hosts);
}
