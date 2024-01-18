import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
var cron = require('node-cron');


async function isAlive(key: string) {
    try {
        const keyState = await prisma.apiKey.findUnique({
            where: {
                key: key,
            },
        });

        if (!keyState) {
            return false;
        }


        return true;
    } catch (error) {
        return false;
    }
}


export async function POST(req: Request) {
    // extract the API key from the request headers
    const apiKey = req.headers.get('x-api-key');

    if (isAlive(apiKey) === false) {
        return new Response(JSON.stringify({ error: 'Invalid API key' }), {
            status: 403,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    const task = cron.schedule('* * * * *', () =>  {
        console.log('will execute every minute until stopped');
    }, {
        name: 'my-task'
    });
    

    return new Response(JSON.stringify({ success: 'Cron job addded' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};


export async function GET(req: Request) {

    if (req.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed!' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    
    const tasks = cron.getTasks();

     return NextResponse.json(tasks.entries());


};