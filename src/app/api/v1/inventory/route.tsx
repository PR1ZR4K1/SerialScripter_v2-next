// pages/api/validateApiKey.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHost } from '@/lib/prismaHelper';

async function decrementLifetime() {
    try {
        const updatedRecord = await prisma.aPI_KEYS.update({
            where: {
                id: 1,  // or your unique identifier
            },
            data: {
                lifetime: {
                    decrement: 1
                }
            },
            select: {
                lifetime: true  // only return the lifetime field
            }
        });

        // console.log("Updated lifetime:", updatedRecord.lifetime);
    } catch (error) {
        console.error("Error updating lifetime:", error);
    }
}

async function isAlive() {
    try {
        const alive = await prisma.aPI_KEYS.findUnique({
            where: {
                id: 1,  // or your unique identifier
            },
            select: {
                lifetime: true  // only return the lifetime field
            }
        });

        // console.log("Lifetime:", alive.lifetime);
        if (alive) {

            if (alive.lifetime > 0) {
                return true;
            } else {
                return false;
            }
        }
    } catch (error) {
        console.error("Error grabbing lifetime:", error);
    }

}

export async function POST(req: Request) {

  if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed!' }), {
          status: 405,
          headers: {
              'Content-Type': 'application/json'
          }
      });
  }



  
  const alive = await isAlive();
  
  if (alive) {

    const envKey = process.env.API_KEY;
    const reqKey = req.headers.get('x-api-key');

    if (reqKey === envKey) {

        // get host object
        const host = await req.json();

        createHost(host);

        decrementLifetime();
        return NextResponse.json({ message: "Valid API Key" });
    
    } else {

        console.log("Invalid API Key");
        return new Response(JSON.stringify({ error: 'Cringe baby you dont know the code L!' }), {
            status: 405,
            headers: {
                    'Content-Type': 'application/json'
                }   
            });
    }
  } else {
    // console.log("API Key is dead");
    return new Response(JSON.stringify({ error: 'API Key is dead!' }), {
        status: 405,
        headers: {
                'Content-Type': 'application/json'
            }   
        });
  }
}