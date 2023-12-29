// pages/api/validateApiKey.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHost } from '@/lib/prismaHelper';
import { Container } from '@prisma/client';

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
            return alive.lifetime > 0
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
  
  type ExtendedContainer = Container & {
    networks: {
      id: number;
      networkName: string;
      ipAddress: string;
      macAddress: string;
    }[];
    volumes: {
      id: number;
      volumeName: string;
      hostPath: string;
      containerPath: string;
      mode: string;
      rw: boolean;
      vType: string;
    }[];
  };

  if (alive) {

    const envKey = process.env.API_KEY;
    const reqKey = req.headers.get('x-api-key');

    if (reqKey === envKey) {

        // get host object
        const host = await req.json();

        if (host.containers) {
            const updatedContainers = host.containers.map((container: ExtendedContainer) => {
                // Create a new object with the renamed fields
                return {
                    ...container, // Spread the rest of the container properties
                    containerId: container.containerId.substring(0, 12), // Rename id to containerId
                    containerNetworks: container.networks, // Rename networks to containerNetworks
                    containerVolumes: container.volumes, // Rename volumes to containerVolumes
                    networks: undefined, // Optional: remove the original networks field
                    volumes: undefined // Optional: remove the original volumes field
                };
            });

            // If you want to update the host.containers array itself
            host.containers = updatedContainers;
        }
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