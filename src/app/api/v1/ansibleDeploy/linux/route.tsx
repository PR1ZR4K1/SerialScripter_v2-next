import path from "path";
import fs from 'fs';
import { DriveFileMove } from "@mui/icons-material";
import { exec } from "child_process";

// Need multiple post routes one for inventory initialization and one for playbook execution and ad hoc commands
// Inventory initalization should check connection state after adding to inventory.ini
// Need to add the connectionType, shellType, and ansibleUser as parameters for this endpoint
// Maybe need user intervention for the ansible variables
// Could set default values and attempt a connection
export async function POST(req: Request) {
    const dirPath = path.join(__dirname, 'inv');
    const filePath = path.join(dirPath, 'inventory.ini');

    // Ansible env variables
    const connectionType = "ssh"
    const shellType = "powershell"
    const ansibleUser = "Administrator"
    const ansiblePort = "69420"
    const invVars = `ansible_port=${ansiblePort} ansible_connection=${connectionType} ansible_shell_type=${shellType} ansible_user=${ansibleUser}`

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

        // initalize_inventory(dirPath, filePath)
        // const content = hostIp + " " + invVars;

        // fs.writeFile(filePath, content, err => {
        //     if (err) {
        //         console.error(err)
        //         return
        //     }
        //     //file written successfully
        // });

        // console.log('contnet stuff bruh: ', content)

        // fs.readFile(filePath, 'utf8', (err, data) => {
        //     if (err) {
        //         console.error(err)
        //         return
        //     }
        //     console.log('data stuff bruh: ', data)
        // });
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

function initalize_inventory(dirPath: string, filePath: string) {    
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }

    //checks if filePath has content
    //if not, then initialize it with a blank string
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '', 'utf8')
    }

    console.log("Inventory file initalized!")
}

async function executePlaybook() {
    // Execute the playbook
    const { stdout, stderr } = await exec('ansible-playbook -i inventory.ini playbook.yml');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
}