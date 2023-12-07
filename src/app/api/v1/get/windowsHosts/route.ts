import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const revalidate = 1;

export async function GET(req: Request) {
  const windowsHosts = await prisma.host.findMany({
    where: {
      os: {
        name: 'Windows', // Filter hosts where the related OS name is 'Linux'
      }
    },
    include: {
      os: true, // Include the related OS data in the response
      // Add other relations here if needed
    }
  });

  return NextResponse.json(windowsHosts);
}
