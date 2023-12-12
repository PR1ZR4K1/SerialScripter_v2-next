import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method not allowed!' }), {
                status: 405,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { newHost } = await req.json();
        const { os, ...hostDataWithoutOS } = newHost;

        // Create a new OS record for each host
        const createdOS = await prisma.oS.create({
            data: { name: os.name, version: os.version || '' }
        });

        // Upsert the host data
        try {
            await prisma.host.upsert({
                where: { ip: hostDataWithoutOS.ip },
                create: { ...hostDataWithoutOS, osId: createdOS.id },
                update: { ...hostDataWithoutOS, osId: createdOS.id }
            });

            return new Response(JSON.stringify({ success: 'Host added to database' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
            
        } catch (error) {
            console.error('Error in upserting host:', error);
            return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
    } catch (error) {
        console.error('Error in processing request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
