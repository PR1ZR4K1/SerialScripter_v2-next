import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { Agent, setGlobalDispatcher } from 'undici'
import { createLogEntry } from '@/lib/ServerLogHelper';
import { authOptions } from '@/app/api/auth/[...nextauth]/AuthOptions';
import { getServerSession } from "next-auth/next"

export const revalidate = 10;

type RuleType = Omit<Prisma.FirewallRuleCreateInput, 'protocol' | 'dport'> & {
    action: string;
    dport: number;
    protocol: string;
    description: string;
}

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
        const { hostId, hostIp, rules }: { hostId: number, hostIp: string, rules: RuleType[] } = await req.json();
        
        // make sure all required fields are present
        if (!hostId || !hostIp || !rules) {
            return new Response(JSON.stringify({ error: 'Missing hostId, hostIp, or rules!' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const session = await getServerSession(authOptions)
        userEmail = session?.user?.email || ''
        // get the firewall key from the database
        const firewallKey = await prisma.apiKey.findFirst({
            where: {
                type: 'FIREWALL',
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

        type formattedRulesType = {
            drop: string[];
            accept: string[];
        }

        let formattedRules: formattedRulesType = { drop: [], accept: [] };
        rules.forEach((rule) => {
            if (rule.action === 'drop') {
                formattedRules.drop.push(rule.dport.toString());
            } else {
                formattedRules.accept.push(rule.dport.toString());
            }
        });

        const result = await fetch(`https://${hostIp}:8000/hippity/hoppity/your/packets/are/my/property`, {
            method: 'PUT',
            headers: {
                'API-Token': firewallKey.key,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formattedRules)
        });

        // const result = await fetch(`https://192.168.1.194:8000/hippity/hoppity/your/packets/are/my/property`, {
        //     method: 'PUT',
        //     headers: {
        //         'API-Token': firewallKey.key,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(formattedRules)
        // });

        // make sure the request was successful
        if (!result.ok) {
            createLogEntry({email: userEmail, success: false, module: 'Firewall Rules', message: `Failed to update rules on remote host!\n${result}`})

            return new Response(JSON.stringify({ error: 'Failed to update rules on remote host!' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // update description field for rules in db
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
                        protocol: 'tcp',
                        description: rule.description,
                    },
                    create: {
                        action: rule.action,
                        dport: rule.dport,
                        protocol: 'tcp',
                        description: rule.description,
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
                    createLogEntry({email: userEmail, success: false, module: 'Firewall Rules', message: `Failed to add firewall rules!\n${error.message}`})

                    return new Response(JSON.stringify({ error: `Failed to add firewall rules! ${error.message}` }), {
                        status: 500,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }
            }

            createLogEntry({email: userEmail, success: false, module: 'Firewall Rules', message: `Failed to add firewall rules!\n${error}`})
            return new Response(JSON.stringify({ error: `Failed to add firewall rules! ${error}` }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        createLogEntry({email: userEmail, success: true, module: 'Firewall Rules', message: `Successfully changes rules on ${hostIp}!`})

        return new Response(JSON.stringify({ msg: 'Successfully changed rules on remote host' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        const networkError = error as NodeJS.ErrnoException;

        if (networkError.message) {
            createLogEntry({email: userEmail, success: false, module: 'Firewall Rules', message: `Failed to update firewall rules!\n${networkError.message}`})

            return new Response(JSON.stringify({ error: `Failed to update firewall rules!\n${networkError.message}` }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            createLogEntry({email: userEmail, success: false, module: 'Firewall Rules', message: `Failed to update firewall rules!\n${error}`})
            return new Response(JSON.stringify({ error: `Failed to get firewall rules! ${error}` }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }
}