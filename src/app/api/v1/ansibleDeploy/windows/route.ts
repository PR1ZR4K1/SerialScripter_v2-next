import { authOptions } from '@/app/api/auth/[...nextauth]/AuthOptions';
import { createLogEntry } from '@/lib/ServerLogHelper';
import { prisma } from '@/lib/prisma';
import { exec } from 'child_process';
import { getServerSession } from 'next-auth';
import util from 'util';

const execPromise = util.promisify(exec);


export async function POST(req: Request) {

    let userEmail = ''

    try {
        // Ensure the request is of type POST
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method not allowed!' }), {
                status: 405,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        const { hostIp, playbook, extra_vars } = await req.json();

        // Parse the JSON body from the request

        // You might want to add some validation for the received data here
        if (!hostIp || !playbook) {
            return;
        }

        // console.log('host ip', hostIp)
        // console.log('\nplaybook', playbook)
        // get clients session to generate logs with
        const session = await getServerSession(authOptions)
        userEmail = session?.user?.email || ''
        
        const data = await prisma.host.findUnique({
            where: {
                ip: hostIp
            },
            select: {
                password: true
            }
        })

        if (!data) {
            return new Response(JSON.stringify({ error: `Host password not found in database` }), {
                status: 408,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const password = data.password || '';
        // extra vars is optional
        const {stdout, stderr} = await executePlaybook(hostIp, playbook, password, extra_vars || '');

        if (stderr) {
            createLogEntry({email: userEmail, success: false, module: 'Public Key Deployment', message: stderr })

            // console.log(stdout);
            return new Response(JSON.stringify({ error: `Ansible Playbook Error\n${stderr}` }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        }

        // Here, include the logic to handle the data,
        // like calling the backend service
        createLogEntry({email: userEmail, success: true, module: 'Ansible Deployment', message: `Successfully deployed ${playbook} to ${hostIp}!` })

        // Sending back a successful response
        return new Response(JSON.stringify({ message: 'Playbook deployed successfully', output: stdout }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });


    } catch (error: any) {
    // Check if the error is an instance of Error
        // if (error instanceof Error) {
        // } else {
        //     // Handle cases where the error is not an Error instance
        // }
        if (error?.stdout) {

            const data = JSON.parse(error.stdout)
            const logMessage = data.plays[0].tasks[0].hosts || 'Unknown error'
            // console.log(logMessage)
            createLogEntry({email: userEmail, success: false, module: 'Ansible Deployment', message: `Ansible Playbook Failed\n${JSON.stringify(logMessage)}` })
            
            // console.log(error.stdout)
            return new Response(JSON.stringify({ error: `Internal Server Error\n ${typeof error}`, output: error.stdout }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            return new Response(JSON.stringify({ error: `Internal Server Error\n ${typeof error}`, output: 'Unknown error' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }
}

async function executePlaybook(hostIP: string, playbook: string, password: string, extra_vars: string = '') {
    // Execute the playbook
    // const { stdout, stderr } = await execPromise(`ansible-playbook -i ${hostIP}, /app/playbooks/linux/${playbook}.yml -e "ansible_user=root ansible_shell_type=sh ansible_connection=ssh ${extra_vars}"`);
    const { stdout, stderr } = await execPromise(`ansible-playbook -i ${hostIP}, ./playbooks/windows/${playbook}.yml -e "ansible_user=root ansible_shell_type=sh ansible_connection=ssh ansible_password=${password} ${extra_vars}"`);
    // const { stdout, stderr } = await execPromise(`pwd`);
    // console.log('stdout:', stdout);
    // console.log('stderr:', stderr);

    return {stdout, stderr}
}