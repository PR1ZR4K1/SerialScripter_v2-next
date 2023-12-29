import { prisma } from '@/lib/prisma';
import { processArray, createHostConnect, HostConnect } from '@/lib/prismaHelper';
import { Prisma } from '@prisma/client';

export const revalidate = 10;
import { Agent, setGlobalDispatcher } from 'undici'

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

        const albertosFunKey = await prisma.aPI_KEYS.findUnique({
            where: {
                id: 1,
            },
            select: {
                albertosFunKey: true,
            }
        });

        if (!albertosFunKey) {
            return new Response(JSON.stringify({ error: 'Failed to get FUN key!' }), {
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

        // const result = await fetch(`https://${hostIp}:8000/here/are/my/rules/sire`, {
            // method: 'GET',
            // headers: {
                // 'API-Token': albertosFunKey.albertosFunKey,
                // 'Content-Type': 'application/json'
            // },
        // });

        // const result = await fetch(`https://192.168.1.22:8000/here/are/my/rules/sire`, {
            // method: 'GET',
            // headers: {
                // 'API-Token': albertosFunKey.albertosFunKey,
                // 'Content-Type': 'application/json'
            // },
        // });

        // if (!result.ok) {
        //     return new Response(JSON.stringify({ error: 'Failed to connect to remote host container!' }), {
        //         status: 500,
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        // }

        // const data = await result.json();

        const data = { 'rules': [{ 'action': 'drop', 'dport': '22', 'protocol': 'tcp' }, { 'action': 'accept', 'dport': '80', 'protocol': 'tcp' }, { 'action': 'drop', 'dport': '1000', 'protocol': 'tcp' }, {action: 'accept', dport: '443', protocol: 'tcp'}]}

        const hostRules: RulesType[] = data.rules;
        
        if (hostRules && hostRules.length > 0) {

            const rules = hostRules.map((rule) => {
                return {
                    ...rule,
                    dport: parseInt(rule.dport),
                }
            });
            try {
                rules.forEach(async (rule) => {
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
                        return new Response(JSON.stringify({ error: `Failed to add firewall rules! ${error.message}` }), {
                            status: 500,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                    }
                }
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

        }
    } catch (error) {
        const networkError = error as NodeJS.ErrnoException;

        if (networkError.message) {

            return new Response(JSON.stringify({ error: `Failed to get firewall rules!\n${networkError.message}` }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            return new Response(JSON.stringify({ error: `Failed to get firewall rules! ${error}` }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }
};