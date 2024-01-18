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
    
    const {publicKey}: {publicKey: string} = await req.json();

    if (!publicKey) {
        return new Response(JSON.stringify({ error: 'Key not supplied!' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

  try {

    await prisma.sshKey.delete({
        where: {
            publicKey: publicKey,
        },
    });
    
  } catch (error) {

    return new Response(JSON.stringify({ error: `Failed to delete record!\n${error}` }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
  }

    return new Response(JSON.stringify({ success: 'key removed' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};