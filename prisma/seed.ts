const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

interface HostData {
    hostname: string;
    ip: string;
    osName: string;
    osVersion: string;
    cpuCores: number;
    memory: number;
    disk: number;
    status: 'UP' | 'DOWN'; // Update with appropriate status values
    macAddress: string;
    networkServices?: NetworkServiceTypes[];
    userAccounts?:   UserAccountTypes[];

}

interface UserAccountTypes {
    username: string;
    password: string;
    userType: 'PRIVILEGED' | 'USER';
    // lastLogin: Date;
    // loginAttempts: number;
}

interface NetworkServiceTypes {
    name: string;
    description?: string;
    port: number;
    status: 'UP' | 'DOWN'; // Update with appropriate status values
}

async function createNetworkServices(services: NetworkServiceTypes[], hostId: number) {
    return Promise.all(services.map(service => 
        prisma.networkService.create({
            data: {
                name: service.name,
                description: service.description,
                port: service.port,
                status: service.status,
                hostId: hostId, // Link each service to the created host
            },
        })
    ));
}

async function createHost({ hostname, ip, osName, osVersion, cpuCores, memory, disk, status, networkServices }: HostData) {

    // Create OS records
    const os = {
        name: osName,
        version: osVersion,
    };

    const createdOS = await prisma.oS.create({ data: os });

    // Create SystemSpec records
    const specs = {
        cpuCores,
        memory,
        disk,
    };

    const createdSpecs = await prisma.systemSpec.create({ data: specs });

    // Create Host record
    const host = {
        hostname,
        ip,
        os: { connect: { id: createdOS.id } },
        systemSpec: { connect: { id: createdSpecs.id } },
        status,
    };

    const createdHost = await prisma.host.create({ data: host });

    // Create related records for the host's services
    if (networkServices && networkServices.length > 0) {
        await createNetworkServices(networkServices, createdHost.id);
    }

    // Additional data creation (software, containers, volumes) can be added here if needed

    return createdHost;
}

async function main() {
    const host1Services: NetworkServiceTypes[] = [
        {
            name: 'SMB',
            port: 445, // SMB typically uses port 445
            description: 'Server Message Block for file sharing',
            status: 'UP',
        },
        {
            name: 'IIS',
            port: 80,
            description: 'Internet Information Services',
            status: 'UP',
        },
        {
            name: 'MSSQL',
            port: 1433,
            description: 'Microsoft SQL Server database service',
            status: 'DOWN',
        }
    ];

    const host1UserAccounts: UserAccountTypes[] = [
        {
            username: 'root',
            password: 'password123',
            userType: 'PRIVILEGED',
        },
        {
            username: 'kevin',
            password: 'password123',
            userType: 'USER',
        },
        {
            username: 'bruce',
            password: 'password123',
            userType: 'USER',
        },
    ];


    const host2Services: NetworkServiceTypes[] = [
        {
            name: 'sshd',
            port: 22,
            description: 'SSH Daemon',
            status: 'UP',
        },
        {
            name: 'Apache',
            port: 80,
            description: 'Web Server',
            status: 'UP',
        },
        {
            name: 'MySQL',
            port: 3306,
            description: 'MySQL Database Service',
            status: 'DOWN',
        }
    ];

    const host2UserAccounts: UserAccountTypes[] = [
        {
            username: 'administrator',
            password: 'password123',
            userType: 'PRIVILEGED',
        },
        {
            username: 'lupe',
            password: 'password123',
            userType: 'USER',
        },
        {
            username: 'hector',
            password: 'password123',
            userType: 'USER',
        },
    ];
    
    const host1 = await createHost({
        hostname: 'bobby',
        ip: '192.168.60.253',
        osName: 'Linux',
        osVersion: 'Ubuntu 20.04',
        cpuCores: 4,
        memory: 8192,
        disk: 256,
        status: 'UP',
        macAddress: '00:1A:2B:3C:4D:5E',
        networkServices: host1Services,
        userAccounts: host1UserAccounts,
    });

    const host2 = await createHost({
        hostname: 'shmurda',
        ip: '192.168.60.254',
        osName: 'Windows',
        osVersion: 'Windows 10 Pro',
        cpuCores: 8,
        memory: 16384,
        disk: 512,
        status: 'UP',
        macAddress: '56:78:9A:BC:DE:F0',
        networkServices: host2Services,
        userAccounts: host2UserAccounts,
    });

    // Additional hosts can be created in a similar way

    console.log('Hosts created:', host1, host2);
}

main()
    .catch(e => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
