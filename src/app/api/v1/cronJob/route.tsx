import { prisma } from '@/lib/prisma';
import { PrismaClient, Prisma } from '@prisma/client';
export const dynamic = "force-dynamic"
import { exec } from 'child_process';
import { promisify } from 'util';

var cron = require('node-cron');


async function isAlive(key: string) {
    try {
        const keyState = await prisma.apiKey.findUnique({
            where: {
                key: key,
            },
            select: {
                key: true  // only return the lifetime field
            }
        });

        if (!keyState) {
            return false;
        }


        return true;
    } catch (error) {
        return false;
    }
}



export async function POST(req: Request) {
    // Parse the JSON body from the request
    const postData = await req.json();

    // Extract name, schedule, and command from the POST data
    const { name, schedule, command, action } = postData;

    switch (action) {
        case "create":
            try {
                console.log("Attempting to create cron job with name: ", name);

                const existingJobs = await prisma.cronJob.findUnique({
                    where: {
                        name: name,
                    },
                    select: {
                        name: true  // only return the lifetime field
                    }
                });

                if (existingJobs) {
                    return new Response(JSON.stringify({ error: 'Cron job with that name already exists' }), {
                        status: 400,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }

                if (!cron.validate(schedule)) {
                    return new Response(JSON.stringify({ error: 'Invalid cron schedule' }), {
                        status: 400,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }
                const execAsync = promisify(exec);
                const task = cron.schedule(schedule, async () => {
                    console.log(command);
                    try {
                        const { stdout, stderr } = await execAsync(command);
                        if (stderr) {
                            await prisma.cronJob.update({
                                where: { name: name },
                                data: { lastOutput: "Error: " + stderr }
                            });
                        } else {
                            await prisma.cronJob.update({
                                where: { name: name },
                                data: { lastOutput: stdout }
                            });
                        }
                    } catch (error) {
                        await prisma.cronJob.update({
                            where: { name: name },
                            data: { lastOutput: "Exec Error: " + "error"}
                        });
                    }
                }, {
                    name: name
                });


                await prisma.cronJob.create({
                    data: {
                        name: name,
                        schedule: schedule,
                        command: command,
                    },
                });

                return new Response(JSON.stringify({ success: 'Cron job addded' }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
  
            } catch (error) {
                return new Response(JSON.stringify({ error: 'Error adding cron job' }), {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
        case "stop":
            try {
                console.log("Attempting to stop cron job with name: ", name);
                const tasks = cron.getTasks();
                for (let [key, value] of tasks.entries()) {
                    if (key == name) {
                        value.stop();
                        console.log("Job sucesfully stopped");
                        await prisma.cronJob.delete({
                            where: {
                                name: key,
                            },
                        });
                        break;
                    }
                }

                return new Response(JSON.stringify({ success: 'Cron job stopped' }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } catch (error) {
                console.log(error);
                return new Response(JSON.stringify({ error: 'Error stopping cron job' }), {
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

    const existingJobs = await prisma.cronJob.findMany({
        select: {
            id: true,
            name: true,
            schedule: true,
            command: true,
            lastOutput: true,
        }
    });

    return new Response(JSON.stringify({ tasks: existingJobs }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });

};