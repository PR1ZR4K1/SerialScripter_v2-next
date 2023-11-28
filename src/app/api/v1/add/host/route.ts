import { prisma } from '@/lib/prisma';

// this is a helper function used to check if the host that I want to  
export async function POST(req: Request) {
    
    try {
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method not allowed!' }), {
                status: 405,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    
        const { newHost } = await req.json();

        const { id, ...hostDataWithoutId } = newHost;

        console.log('The new host object', hostDataWithoutId)

        try {
            await prisma.host.upsert({
                where: {
                    ip: hostDataWithoutId.ip,
                    hostname: hostDataWithoutId.hostname,
                },
                create: {
                    ...hostDataWithoutId
                },
                update: {
                    ...hostDataWithoutId
                }
            });
    
            return new Response(JSON.stringify({ success: 'Host added to database' }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
        } catch (error) {
            
            return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

}