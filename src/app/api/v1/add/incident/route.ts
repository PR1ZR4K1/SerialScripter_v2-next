import { prisma } from '@/lib/prisma';
import { promisify } from 'util';
import zlib from 'zlib';
import { IncidentTag } from '@prisma/client';

const gzip = promisify(zlib.gzip);

export async function POST(req: Request) {

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed!' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    
    const formData = await req.formData();

    if (!formData) {
        new Response(JSON.stringify({ error: 'Incident not supplied!' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
  
    const name = formData.get('name') as string
    const ip = formData.get('ip') as string
    const hostname = formData.get('hostname') as string
    const description = formData.get('description') as string
    const file = formData.get('attachment'); 
    const tags: IncidentTag[] = [];

    for (const [key, value] of formData.entries()) {
      if (key === 'tag') {
        tags.push(value as IncidentTag);
      }
    }

    if (file) {
        const fileInstance = file as unknown as File;

        const buffer = await fileInstance.arrayBuffer();
        const nodeBuffer = Buffer.from(buffer);

        try {
            // Compress the file
          const compressedFile = await gzip(nodeBuffer);
          
          const hostId = await prisma.host.findUnique({
            where: {
              ip: ip,
            },
            select: {
              id: true,
            },
          });

          await prisma.incident.create({
            data: {
              name: name,
              ip: ip,
              hostname: hostname,
              attachment: compressedFile,
              description: description,
              tags: tags,
              filename: fileInstance.name,
              hostId: hostId?.id,
            },
          });
            // ... rest of your code ...
        } catch (error) {
            new Response(JSON.stringify({ error: `Incident upload failed!\n ${error}` }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }

    return new Response(JSON.stringify({ success: 'Successfully uploaded incident to db' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}