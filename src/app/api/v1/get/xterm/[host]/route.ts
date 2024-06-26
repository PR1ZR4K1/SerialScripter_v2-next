import { spawn } from 'child_process';
import { promisify } from 'util';
import { type NextRequest } from 'next/server'
import { createServer } from 'net';

function spawnGotty(username: string, host: string, port: number, serialIp: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const gotty = spawn('./gotty', [
            '--timeout', '10',
            '-p', port.toString(),
            '-t',
            '--tls-key', '/etc/ssl/private/key.pem',
            '--tls-crt', '/etc/ssl/certs/cert.pem',
            '-w', '-r',
            'ssh', `${username}@${host}`
        ], {
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe'], // 'pipe' for stdout and stderr
        });

        gotty.unref(); // Ensures that the parent process can exit independently of the child

        let output = '';
        gotty.stderr.on('data', (data) => {
            console.log("Received data from GoTTY:", data.toString()); // Temporarily log data for debugging
            output += data.toString();
            // Process or check the output here if needed
            // If the URL or necessary data is found in the output, you can resolve the promise
            // For example:
            const urlMatch = getUrl(output, serialIp); // Adjust the regex to match your needs
            if (urlMatch) {
                resolve(urlMatch); // Resolve the promise with the URL
            }
        });

        gotty.stdout.on('data', (data) => {
            console.error(`STDERR: ${data}`);
        });

        gotty.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`gotty process exited with code ${code}`));
            } else {
                resolve(output); // Resolve with the full output if process exits successfully
            }
        });

        gotty.on('error', (err) => {
            reject(err);
        });
    });
}

function findRandomOpenPort(): Promise<number> {
    return new Promise((resolve, reject) => {
        const server = createServer();
        server.unref();
        server.on('error', (err) => {
            reject(err);
        });
        server.listen(0, () => {
            const address = server.address();
            if (address === null) {
                reject(new Error('Unable to get the address, the server might have been closed.'));
                return;
            }
            const port = (typeof address === 'string') ? parseInt(address.split(':').pop() ?? '0', 10) : address.port;
            server.close(() => {
                resolve(port);
            });
        });
    });
}

function getUrl(input: string, host: string): string | null {
    const lines = input.split('\n'); // Split the input into lines
    console.log('Lines:\n', lines)
    console.log(`Input: ${input}\nHost: ${host}`)
    const lastOctet = host.split(":")[0].split(".")[0];
    const oneNineTwo = "192.168.220." + lastOctet;
    for (const line of lines) {
        if (line.includes("URL") && !line.includes("127.0.0.1") && !line.includes("::1")) {
            if (line.includes(host.split(":")[0])) {
                return line.split("URL:")[1].trim(); // Return the URL if it's valid
            } else if (line.includes(oneNineTwo)) {
                console.log("line", line);
                const url = line.split("URL:")[1].trim();
                // Tranform url to start with 10.100.105+lastOctet
                const urlParts = url.split(":");
                console.log("urlParts", urlParts);
                const newUrl = "https://10.100.105." + lastOctet + ":" + urlParts[2];
                console.log("newUrl", newUrl);
                return newUrl;
            }
        }
    }
    return null; // Return null if no valid URL is found
}



export async function GET(
    req: NextRequest,
    { params }: { params: { host: string } }
) {
    const serialIp = req.headers.get('X-Forwarded-For') || '127.0.0.1'
    // console.log("serialIp", serialIp);

    const searchParams = req.nextUrl.searchParams;
    const os = searchParams.get('os');

    // console.log("os", os);

    const username = os?.toLowerCase() === 'linux' ? 'root' : 'Administrator';
    const port = await findRandomOpenPort();

    // https://localhost:33/eg/.ere/192.168.220.1?os=windows
    const { host } = params;

    //find open port on system using sockets

    //const cmd = "./gotty --timeout 10 -p {port} -t --tls-crt website/data/cert.pem --tls-key website/data/key.pem -w -r ssh {user}@{ip}",
    //    const cmd = `/usr/local/bin/gotty --timeout 10 -p ${port} -t --tls-crt /etc/ssl/private/key.pem --tls-key /etc/ssl/certs/cert.pem -w -r ssh ${username}@${host}`;

    const url = await spawnGotty(username, host, port, serialIp);

    //const url = getUrl(stdout, serialIp);
    console.log("url", url);


    // should return json like { url: 'https://localhost:33' }
    return Response.json({ url });
}
