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
        const { hostIp, playbook } = await req.json();

        // Parse the JSON body from the request

        // You might want to add some validation for the received data here
        if (!hostIp || !playbook) {
            return;
        }

        // console.log('host ip', hostIp)
        // console.log('\nplaybook', playbook)

        executeAdHoc(hostIp);

        // Here, include the logic to handle the data,
        // like calling the backend service

        // Sending back a successful response

        return new Response(JSON.stringify({ message: 'Data processed successfully' }), {
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
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

// add param to change adHoc Command and receive adHoc command
async function executeAdHoc(hostIP: string) {
    // Execute the playbook
    const { stdout, stderr } = await execPromise(`ansible all -i ${hostIP}, -m win_ping -e "ansible_connection=ssh ansible_shell_type=powershell ansible_user=Administrator"`);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
}