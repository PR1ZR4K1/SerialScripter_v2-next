import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { Agent, setGlobalDispatcher } from 'undici'


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

        const result = await fetch(`https://${hostIp}:8000/hippity/hoppity/your/packets/are/my/property/update`, {
            method: 'PUT',
            headers: {
                'API-Token': firewallKey.key,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formattedRules)
        });

        // const result = await fetch(`https://192.168.1.21:8000/hippity/hoppity/your/packets/are/my/property/update`, {
        //     method: 'PUT',
        //     headers: {
        //         'API-Token': firewallKey.key,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(formattedRules)
        // });

        // make sure the request was successful
        if (!result.ok) {
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

        return new Response(JSON.stringify({ msg: 'Successfully changed rules on remote host' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
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
}