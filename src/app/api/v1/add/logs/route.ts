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
    
    const newLog = await req.json();

    const logEntry = await prisma.serverLog.create({
        data: {
            ...newLog,
        },
    });
    return Response.json(logEntry);
}