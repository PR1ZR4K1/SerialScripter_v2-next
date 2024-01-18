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

    let logs = [];

    try {
      logs = await prisma.serverLog.findMany();

    } catch (error) { 
        return new Response(JSON.stringify({ error: `Failed to get Server Logs from db!\n${error}` }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

  return new Response(JSON.stringify(logs), {
      status: 200,
      headers: {
          'Content-Type': 'application/json'
      }
  });

}