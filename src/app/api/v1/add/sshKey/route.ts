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
    
    const {name, publicKey}: {name: string, publicKey: string} = await req.json();

    if (!name || !publicKey) {
        new Response(JSON.stringify({ error: 'Name or Key not supplied!' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    await prisma.sshKey.create({
        data: {
            name,
            publicKey,
        },
    });

    return new Response(JSON.stringify({ success: 'key added' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};