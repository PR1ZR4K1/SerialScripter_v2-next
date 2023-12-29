import { prisma } from '@/lib/prisma';

import { NextResponse } from 'next/server';
// import { revalidatePath } from 'next/cache'
export const revalidate = 10;

export async function GET(req: Request) {

  const hosts = await prisma.host.findMany({
    include:
      {
        os:
          {
            select:
              {
                name: true,
                version: false
              }
          }
      }
  });
  

  return NextResponse.json({ now: Date.now(), data: hosts })
  
  // return NextResponse.json(hosts);
}
