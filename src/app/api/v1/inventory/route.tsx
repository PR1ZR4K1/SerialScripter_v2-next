// pages/api/validateApiKey.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHost } from '@/lib/prismaHelper';
import { Container } from '@prisma/client';

async function decrementLifetime(key: string) {
async function decrementLifetime(key: string) {
    try {
        const updatedRecord = await prisma.apiKey.update({
            where: {
                key: key,
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
async function isAlive(key: string) {
    try {
        const keyState = await prisma.apiKey.findUnique({
            where: {
                key: key,
            },
            select: {
                lifetime: true  // only return the lifetime field
            }
        });

        if (!keyState) {
            return false;
        }

        // console.log("Lifetime:", alive.lifetime);
        if(keyState.lifetime === null) {
            return true;
        }
        return keyState.lifetime > 0;
    } catch (error) {
        console.error("Error grabbing lifetime:", error);
    }
}

export async function POST(req: Request) {
    // extract the API key from the request headers
    const apiKey = req.headers.get('x-api-key');

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed!' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'No API Key provided!' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    const alive = await isAlive(apiKey);

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

        decrementLifetime(apiKey);
        return NextResponse.json({ message: "Valid API Key" });

    } else {
        // console.log("API Key is dead");
        return new Response(JSON.stringify({ error: 'Invalid API Key' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
