import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);


export async function POST(req: Request) {

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

        // extra vars is optional
        const {stdout, stderr} = await executePlaybook(hostIp, playbook, extra_vars || '');

        if (stderr) {
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

        // Sending back a successful response
        return new Response(JSON.stringify({ success: 'Playbook deployed successfully', output: stdout }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error: unknown) {
    // Check if the error is an instance of Error
        // if (error instanceof Error) {
        // } else {
        //     // Handle cases where the error is not an Error instance
        // }
        return new Response(JSON.stringify({ error: `Internal Server Error\n ${error}` }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

async function executePlaybook(hostIP: string, playbook: string, extra_vars: string = '') {
    // Execute the playbook
    const { stdout, stderr } = await execPromise(`ansible-playbook -i ${hostIP}, /app/playbooks/linux/${playbook}.yml -e "ansible_user=root ansible_shell_type=sh ansible_connection=ssh ${extra_vars}"`);
    // const { stdout, stderr } = await execPromise(`pwd`);
    // console.log('stdout:', stdout);
    // console.log('stderr:', stderr);

    return {stdout, stderr}
}