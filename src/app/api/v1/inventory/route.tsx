// pages/api/validateApiKey.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHost } from '@/lib/prismaHelper';
import { Container } from '@prisma/client';

async function decrementLifetime(key: string) {
    try {
        const updatedRecord = await prisma.aPI_KEY.update({
            where: {
                key: key,  // or your unique identifier
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

async function isAlive(key: string) {
    try {
        const alive = await prisma.aPI_KEY.findUnique({
            where: {
                key: key,  // or your unique identifier
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
  
  const reqKey = req.headers.get('x-api-key');
    
    if (!reqKey) {
        console.log("No API Key");
        return new Response(JSON.stringify({ error: 'No API Key!' }), {
            status: 405,
            headers: {
                    'Content-Type': 'application/json'
                }   
            });
    }
    
  const alive = await isAlive(reqKey);
  
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
    
    // const inventoryKey = await prisma.aPI_KEY.findUnique({
    //       where: {
    //           type: 'INVENTORY',  // or your unique identifier
    //       },
    //       select: {
    //           key: true,
    //           lifetime: true// only return the inventoryKey field
    //       }
    //   });
      

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

        decrementLifetime(reqKey);
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