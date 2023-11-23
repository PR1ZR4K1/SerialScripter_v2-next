// pages/api/scan.js
import { exec } from 'child_process';
import util from 'util';
import { Host } from '@prisma/client';

const execPromise = util.promisify(exec);

async function getOS(ip: string) {

    try {
        const { stdout } = await execPromise(`ping -c 1 ${ip}`);
        const ttlMatch = stdout.match(/ttl=(\d+)/i);

        if (ttlMatch && ttlMatch[1]) {
            const ttl = parseInt(ttlMatch[1]);

            if (ttl > 128) {
                return "Unknown"; // TTLs higher than 128 are not typical for Windows or Linux
            } else if (ttl >= 120) {
                return "Windows";
            } else {
                return "Linux";
            }
        } else {
            console.log(`No TTL found for IP ${ip}`);
            return "Unknown";
        }
    } catch (error) {
        console.log(`Error pinging IP ${ip}: ${error}`);
        return "Unknown";
    }
}


// Function to parse the Nmap output and return a list of Host objects
// @ts-ignore



async function parseNmapOutput(scanOutput: string) {
    const hostReports = scanOutput.split('Nmap scan report for ');
    const hosts: Host[] = [];
    let idCounter = 1;

    for (const report of hostReports) {

        if (report.trim() !== '') {
            const lines = report.split('\n');
            const firstLine = lines[0].trim();
            const ipAddressMatch = firstLine.match(/(\d{1,3}(\.\d{1,3}){3})/);
            const ipAddress = ipAddressMatch ? ipAddressMatch[0] : '';
            const hostnameMatch = firstLine.match(/^[^\s(]+/);
            const hostname = (hostnameMatch && hostnameMatch[0] !== ipAddress) ? hostnameMatch[0] : '';
            const statusMatch = report.match(/Host is up/);
            const status = statusMatch ? 'UP' : 'DOWN';

            // dont append this object
            if (hostname === 'Starting') {
                continue;
            }

            const os = await getOS(ipAddress);

            hosts.push({
                id: idCounter++,
                hostname: hostname,
                ip: ipAddress,
                os: os, // OS information is not provided by Nmap
                cpu_cores: 0, // CPU cores information is not provided by Nmap
                memory: 0, // Memory information is not provided by Nmap
                disk: 0, // Disk information is not provided by Nmap
                status: status,
                createdAt: new Date(),
            });
        }
    };

    return hosts;
}

export async function nmapScan(range: string) {
    try {
        const { stdout } = await execPromise(`nmap -T4 -F ${range}`);

        const parsedScanOutput = await parseNmapOutput(stdout);

        return parsedScanOutput;

    } catch (error) {
        console.error('Error during Nmap scan:', error);
        throw error;
    }
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

    const { range } = await req.json();

    try {
        const scanResults = await nmapScan(range);

        if (scanResults.length > 0) {
            return new Response(JSON.stringify(scanResults), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            console.log('in here is error')
            return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

    } catch (error) {
        console.error('Error during Nmap scan:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
