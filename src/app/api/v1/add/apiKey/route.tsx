import { prisma } from "@/lib/prisma";
import { KeyType } from "@prisma/client";
import { generateApiKey } from  'generate-api-key';
import { addHoursToCurrentTime } from '@/lib/apikeyHelper';






// Required body params keytpe, action
export async function POST(req: Request) {
  // Parse the JSON body from the request
  const postData = await req.json();

  // Extract name, schedule, and command from the POST data
  const { id, keytype, action } = postData;

  const apiKey = generateApiKey({ method: 'string', length: 32}) as string

  switch (action) {
    case "create":
      switch (keytype) {
        case "host": {
          try {
            console.log(apiKey);
            await prisma.apiKey.create({
              data: {
                key: apiKey,
                type: KeyType.HOST,
                lifetime: addHoursToCurrentTime(8),
              },
            });
            return new Response(JSON.stringify({ apiKey }), {
              status: 200,
              headers: {
                'Content-Type': 'application/json'
              }
            });
          } catch {
            return new Response(JSON.stringify({ error: 'Failed to create key' }), {
              status: 500,
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }

        }
        case "firewall":
          try {
            await prisma.apiKey.create({
              data: {
                key: apiKey,
                type: KeyType.FIREWALL,
                lifetime: addHoursToCurrentTime(8),
              },
            });

            return new Response(JSON.stringify({ apiKey }), {
              status: 200,
              headers: {
                'Content-Type': 'application/json'
              }
            });
          } catch {
            return new Response(JSON.stringify({ error: 'Failed to create key' }), {
              status: 500,
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }

        case "general":
          try {
            await prisma.apiKey.create({
              data: {
                key: apiKey,
                type: KeyType.GENERAL,
                lifetime: 0,
              },
            });

            return new Response(JSON.stringify({ apiKey }), {
              status: 200,
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
          } catch {
            return new Response(JSON.stringify({ error: 'Failed to create key' }), {
              status: 500,
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }
          default:
            return new Response(JSON.stringify({ error: 'Invalid keytype' }), {
              status: 400,
              headers: {
                'Content-Type': 'application/json'
              }
            });
      }

    case "delete":
      try {
        // Convert the id to an integer
        const intId = parseInt(id);
        await prisma.apiKey.delete({
          where: {
              id: intId,
          },
      });
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch(error) {
        console.log(error);
        return new Response(JSON.stringify({ error: 'Failed to delete key' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

    case "referesh":
      try {
        const extendedLifetime = addHoursToCurrentTime(8)
        await prisma.apiKey.update({
          where: {
              id: id,
          },
          data: {
              lifetime: extendedLifetime,
          },
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch {
      return new Response(JSON.stringify({ error: 'Failed to refresh key' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    default:
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
  }
  

}

export async function GET(req: Request) {

  if (req.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed!' }), {
          status: 405,
          headers: {
              'Content-Type': 'application/json'
          }
      });
  }

  const keys = await prisma.apiKey.findMany({
      select: {
          id: true,
          key: true,
          type: true,
          lifetime: true,
      }
  });

  return new Response(JSON.stringify(keys), {
      status: 200,
      headers: {
          'Content-Type': 'application/json'
      }
  });

};
