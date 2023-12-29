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

function isErrorWithCode(error: unknown): error is { code: string } {
    return typeof error === 'object' && error !== null && 'code' in error;
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
        const { hostId, hostIp } = await req.json();

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

        // const result = await fetch(`https://${hostIp}:8000/here/are/my/rules/sire`, {
        //     method: 'POST',
        //     headers: {
        //         'API-Token': albertosFunKey,
        //         'Content-Type': 'application/json'
        //     },
        //     // idk what to put in the body
        //     body: '',
        // });

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

        const result = await fetch(`https://192.168.1.22:8000/here/are/my/rules/sire`, {
            method: 'GET',
            headers: {
                'API-Token': albertosFunKey.albertosFunKey,
                'Content-Type': 'application/json'
            },
        });

        if (!result.ok) {
            return new Response(JSON.stringify({ error: 'Failed to connect to remote host container!' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const data = await result.json();

        // const data = {'rules': [{'action': 'accept', 'dport': '22', 'protocol': 'tcp'}, {'action': 'accept', 'dport': '80', 'protocol': 'tcp'}, {'action': 'drop', 'dport': '1000', 'protocol': 'tcp'}]}

        const hostRules: RulesType[] = data.rules;
        
        if (hostRules && hostRules.length > 0) {

            const rules = hostRules.map((rule) => {
                return {
                    ...rule,
                    dport: parseInt(rule.dport),
                }
            });

            try {
                await processArray<Prisma.FirewallRuleCreateInput, HostConnect>(
                    rules,
                    createHostConnect(hostId),
                    (rule) => prisma.firewallRule.create({ data: rule as Prisma.FirewallRuleCreateInput })
                );
            } catch (error) {
                return new Response(JSON.stringify({ error: 'Failed to add rules to DB!' + error }), {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
        }
        return new Response(JSON.stringify({ msg: 'Added rules to DB!' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        const networkError = error as NodeJS.ErrnoException;

        if (networkError.cause) {

            return new Response(JSON.stringify({ error: `Failed to get firewall rules!\n${networkError.cause}` }), {
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