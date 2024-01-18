import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {

    if (req.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed!' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    let incidents = [];

    try {
      incidents = await prisma.incident.findMany({
        select: {
          id: true,
          ip: true,
          hostname: true,
          description: true,
          createdAt: true,
          name: true,
          tags: true,
        },
      });

    } catch (error) { 
        return new Response(JSON.stringify({ error: `Failed to get Incidents from db!\n${error}` }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

  return new Response(JSON.stringify(incidents), {
      status: 200,
      headers: {
          'Content-Type': 'application/json'
      }
  });

}