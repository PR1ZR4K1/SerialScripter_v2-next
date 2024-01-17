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

    const keys = await prisma.sshKey.findMany();

    return Response.json(keys);
}