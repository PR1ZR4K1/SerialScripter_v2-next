import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { Agent, setGlobalDispatcher } from 'undici'
import { createLogEntry } from '@/lib/ServerLogHelper';
import { authOptions } from '@/app/api/auth/[...nextauth]/AuthOptions';
import { getServerSession } from "next-auth/next"


export const revalidate = 10;

type RulesType = {
    action: string;
    dport: string;
    protocol: string;
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
    
    let userEmail = 'firewall.gg';
    
    try {
        const { hostId , hostIp }: {hostId: number, hostIp: string} = await req.json();

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

        const firewallKey = await prisma.apiKey.findFirst({
            where: {
                type: 'FIREWALL',
            },
            select: {
                key: true,
            }
        });

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

        const result = await fetch(`https://${hostIp}:8000/here/are/my/rules/sire`, {
            method: 'GET',
            headers: {
                'API-Token': firewallKey.key,
                'Content-Type': 'application/json'
            },
        });

        // const result = await fetch(`https://192.168.1.194:8000/here/are/my/rules/sire`, {
        //     method: 'GET',
        //     headers: {
        //         'API-Token': firewallKey.key,
        //         'Content-Type': 'application/json'
        //     },
        // });

        if (!result.ok) {

            createLogEntry({email: userEmail, success: false, module: 'Firewall Rules', message: `Connecting to ${hostIp} failed!`})
            return new Response(JSON.stringify({ error: 'Failed to connect to remote host container!' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const data = await result.json();
        // console.log(data)

        // const data = { 'rules': [{ 'action': 'drop', 'dport': '22', 'protocol': 'tcp' }, { 'action': 'accept', 'dport': '80', 'protocol': 'tcp' }, { 'action': 'drop', 'dport': '1000', 'protocol': 'tcp' }, {action: 'accept', dport: '443', protocol: 'tcp'}]}

        const hostRules: RulesType[] = data.rules;
        
        if (hostRules && hostRules.length > 0) { 

            const uniqueRules = hostRules
            .reduce((acc: RulesType[], rule) => {
                // Check if a rule with the same dport already exists in the accumulator
                if (!acc.some(r => r.dport === rule.dport)) {
                    acc.push(rule);
                }
                return acc;
            }, [])
            .map(rule => ({
                ...rule,
                dport: parseInt(rule.dport, 10)
            }));

            try {
                uniqueRules.forEach(async (rule) => {
                    await prisma.firewallRule.upsert({
                        where: {
                            dport_hostId: {
                                dport: rule.dport,
                                hostId: hostId,
                            },
                        },
                        update: {
                            action: rule.action,
                            dport: rule.dport,
                            protocol: rule.protocol,
                        },
                        create: {
                            action: rule.action,
                            dport: rule.dport,
                            protocol: rule.protocol,
                            host: {
                                connect: {
                                    id: hostId,
                                }
                            }
                        },
                    });
                });
            } catch (error) {

                if (error instanceof Prisma.PrismaClientKnownRequestError) {

                    if (error.message) {
                        createLogEntry({email: userEmail, success: false, module: 'Firewall Rules', message: `Failed to fetch firewall rules!\n${error.message}`})
                        return new Response(JSON.stringify({ error: `Failed to add firewall rules! ${error.message}` }), {
                            status: 500,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                    }
                }
                createLogEntry({email: userEmail, success: false, module: 'Firewall Rules', message: `Failed to fetch firewall rules!\n${error}`})
                return new Response(JSON.stringify({ error: `Failed to add firewall rules! ${error}` }), {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            // if all is well display this
            return new Response(JSON.stringify({ msg: 'Added rules to DB!' }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        } else {
            return new Response(JSON.stringify({ error: 'Remote host has no rules!' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        const networkError = error as NodeJS.ErrnoException;

        if (networkError.message) {

            createLogEntry({email: userEmail, success: false, module: 'Firewall Rules', message: `Failed to fetch firewall rules!\n${networkError.message}`})
            return new Response(JSON.stringify({ error: `Failed to get firewall rules!\n${networkError.message}` }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            createLogEntry({email: userEmail, success: false, module: 'Firewall Rules', message: `Failed to fetch firewall rules!\n${error}`})

            return new Response(JSON.stringify({ error: `Failed to get firewall rules! ${error}` }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }
};
