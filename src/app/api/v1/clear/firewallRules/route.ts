import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { Agent, setGlobalDispatcher } from 'undici'
import { createLogEntry } from '@/lib/ServerLogHelper';
import { authOptions } from '@/app/api/auth/[...nextauth]/AuthOptions';
import { getServerSession } from "next-auth/next"


export const revalidate = 10;

export async function POST(req: Request) {

        // make sure it is a post request
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed!' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    let userEmail = 'firewall.gg';

    try {
        
        const { hostId, hostIp }: { hostId: number, hostIp: string } = await req.json();
        
        // make sure all required fields are present
        if (!hostId || !hostIp) {
            
            return new Response(JSON.stringify({ error: 'Missing hostId or hostIp!' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const session = await getServerSession(authOptions)
        userEmail = session?.user?.email || ''

        // get the firewall key from the database
        const firewallKey = await prisma.apiKey.findUnique({
            where: {
                key: '440e585a2a08a4e5b2bef11d3469e6538491cfaec0d3f9a139d8db022e59a03bfd6095f25f876eae7a8689574c2e2687fb4b5c892e238f677b9af81785404703',
            },
            select: {
                key: true,
            }
        });

        // make sure the firewall key was found
        if (!firewallKey) {
            return new Response(JSON.stringify({ error: 'Failed to get firewall key!' }), {
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

        const result = await fetch(`https://${hostIp}:8000/the/rules/didnt/work`, {
            method: 'PUT',
            headers: {
                'API-Token': firewallKey.key,
                'Content-Type': 'application/json'
            },
        });

        // const result = await fetch(`https://192.168.1.194:8000/the/rules/didnt/work`, {
        //     method: 'PUT',
        //     headers: {
        //         'API-Token': firewallKey.key,
        //         'Content-Type': 'application/json'
        //     },
        // }); 

        // // make sure the request was successful
        if (!result.ok) {
            createLogEntry({email: userEmail, success: false, module: 'Firewall Rules', message: 'Failed to clear rules on remote host: result was not okay.' })

            return new Response(JSON.stringify({ error: 'Failed to update rules on remote host!' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // update the database
        try {

            await prisma.firewallRule.deleteMany({
                where: {
                    hostId: hostId,
                }
            });

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {

                if (error.message) {
                    createLogEntry({email: userEmail, success: false, module: 'Firewall Rules', message: `Failed to clear rules on remote host: ${error.message}`})

                    return new Response(JSON.stringify({ error: `Failed to clear firewall rules! ${error.message}` }), {
                        status: 500,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }
            }

            createLogEntry({email: userEmail, success: false, module: 'Firewall Rules', message: `Failed to clear rules on remote host: ${error}`})

            return new Response(JSON.stringify({ error: `Failed to clear firewall rules! ${error}` }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    
        createLogEntry({email: userEmail, success: true, module: 'Firewall Rules', message: `Successfully cleared firewall rules!`})

        return new Response(JSON.stringify({ success: 'Successfully cleared firewall rules!' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        const networkError = error as NodeJS.ErrnoException;

        if (networkError.message) {
            createLogEntry({email: userEmail, success: false, module: 'Firewall Rules', message: `Failed to clear rules on remote host: ${error.message}`})

            return new Response(JSON.stringify({ error: `Failed to clear firewall rules!\n${networkError.message}` }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            createLogEntry({email: userEmail, success: false, module: 'Firewall Rules', message: `Failed to clear rules on remote host: ${error}`})

            return new Response(JSON.stringify({ error: `Failed to clear firewall rules! ${error}` }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }
}