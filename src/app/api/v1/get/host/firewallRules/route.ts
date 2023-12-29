import { prisma } from '@/lib/prisma';


export const revalidate = 10;
import { Agent, setGlobalDispatcher } from 'undici'

export async function POST(req: Request) {
    
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed!' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    
    try {
        const { hostId, hostIp } = await req.json();

        if (!hostId || !hostIp) {
            return new Response(JSON.stringify({ error: 'Missing hostId or hostIp!' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const albertosFunKey = await prisma.aPI_KEYS.findUnique({
            where: {
                id: 1,
            },
            select: {
                albertosFunKey: true,
            }
        });

        // const result = await fetch(`https://${hostIp}:8000/here/are/my/rules/sire`, {
        //     method: 'POST',
        //     headers: {
        //         'API-Token': albertosFunKey,
        //         'Content-Type': 'application/json'
        //     },
        //     // idk what to put in the body
        //     body: '',
        // });

        if (!albertosFunKey) {
            return new Response(JSON.stringify({ error: 'Failed to get FUN key!' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const agent = new Agent({
            connect: {
              rejectUnauthorized: false
            }
          })
          
          setGlobalDispatcher(agent)

        const result = await fetch(`https://192.168.1.21:8000/here/are/my/rules/sire`, {
            method: 'GET',
            headers: {
                'API-Token': albertosFunKey.albertosFunKey,
                'Content-Type': 'application/json'
            },
        });

        if (!result.ok) {
            return new Response(JSON.stringify({ error: 'Failed to connect to remote host container!' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const data = await result.json();

        console.log('This is the result bozo\n', data.rules);

        return new Response(JSON.stringify({ msg: 'Acquired rules' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to connect to remote host container!' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }


};