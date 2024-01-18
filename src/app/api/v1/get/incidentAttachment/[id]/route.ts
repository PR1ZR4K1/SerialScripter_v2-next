import { prisma } from '@/lib/prisma';
import zlib from 'zlib';
import { promisify } from 'util';
export const dynamic = 'force-dynamic';
const gunzip = promisify(zlib.gunzip);

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
    if (req.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed!' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // id for incident
    const id = parseInt(params.id);

    try {
      const incident = await prisma.incident.findUnique({
        where: {
          id: id,
        },
        select: {
          attachment: true,
          filename: true,
        },
      });

      if (!incident || !incident.attachment) {
        return new Response(JSON.stringify({ error: 'Attachment not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
      }

      const decompressed = await gunzip(incident.attachment);
  
        // Set headers for file download
        return new Response(decompressed, {
          status: 200,
          headers: {
              'Content-Type': 'application/octet-stream',
              'Content-Disposition': `attachment; filename=${incident.filename ? incident.filename : `download-${id}`}`,
          }
      });
        // Send the decompressed file

    } catch (error) { 
        return new Response(JSON.stringify({ error: `Failed to get Incidents from db!\n${error}` }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

}