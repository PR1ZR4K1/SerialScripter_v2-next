import { prisma } from '@/lib/prisma';


export async function POST(req: Request) {

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed!' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    
    const {hostname, ip, password}: {hostname: string, ip: string, password: string} = await req.json();

    if (!password) {
        return new Response(JSON.stringify({ error: 'Password not supplied!' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

  try {

    await prisma.host.update({
        where: {
          hostname_ip: {
            hostname,
            ip
          },
        },
        data: {
          password
        },
    });

    return new Response(JSON.stringify({ success: 'Password updated!' }), {
      status: 200,
      headers: {
          'Content-Type': 'application/json'
      }
  });
    
  } catch (error) {

    return new Response(JSON.stringify({ error: `Failed to update password!\n${error}` }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
  }


};