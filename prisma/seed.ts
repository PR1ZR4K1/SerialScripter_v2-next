const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { Disk as PrismaDisk, Prisma } from '@prisma/client';

interface HostData {
    hostname: string;
    ip: string;
    osName: string;
    osVersion: string;
    cpuCores: number;
    cpuName: string
    memory: number;
    status: 'UP' | 'DOWN'; // Update with appropriate status values
    gateway: string,
    dhcp: boolean,
    macAddress: string;
    disks: Disk[];
    systemServices: SystemServiceTypes[];
    networkServices?: NetworkServiceTypes[];
    userAccounts?:   UserAccountTypes[];
}

interface UserAccountTypes {
    name: string;
    password: string;
    userType: 'PRIVILEGED' | 'USER';
    isLocal: Boolean;
    uid: string;
    gid: string;
    // lastLogin: Date;
    // loginAttempts: number;
}

interface Disk {
  name: string;
  mountPoint: string;
  filesystem: string;
  totalSpace: number;
  availableSpace: number;
}

interface NetworkServiceTypes {
    name: string;
    description?: string;
    port: number;
    status: 'OPEN' | 'CLOSED' | 'FILTERED'; 
}

interface SystemServiceTypes {
    name: string;
    description?: string;
    status: 'RUNNING' | 'STOPPED' ; 
}
async function createUserAccounts(userAccounts: UserAccountTypes[], hostId: number) {
    return Promise.all(userAccounts.map(userAccount => 
        prisma.userAccount.create({
            data: {
                name: userAccount.name,
                password: userAccount.password,
                userType: userAccount.userType, // Correct field name as per schema
                hostId: hostId, // Link each user account to the created host
                isLocal: userAccount.isLocal,
                uid: userAccount.uid,
                gid: userAccount.gid,
            },
        })
    ));
};

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
};
async function createSystemServices(services: SystemServiceTypes[], hostId: number) {
    return Promise.all(services.map(service => 
        prisma.systemService.create({
            data: {
                name: service.name,
                description: service.description,
                status: service.status,
                hostId: hostId, // Link each service to the created host
            },
        })
    ));
};

async function createDisks(disks: Disk[], hostId: number): Promise<PrismaDisk[]> {
    console.log("Creating disks for hostId:", hostId);
    console.log("Disks to create:", JSON.stringify(disks, null, 2));

    return Promise.all(disks.map(disk => {
        console.log("Creating disk:", JSON.stringify(disk, null, 2));

        return prisma.Disk.create({
            data: {
                name: disk.name,
                mountPoint: disk.mountPoint,
                filesystem: disk.filesystem,
                totalSpace: disk.totalSpace,
                availableSpace: disk.availableSpace,
                hostId: hostId,
            },
        }).then((createdDisk: PrismaDisk) => {
            console.log("Created disk:", JSON.stringify(createdDisk, null, 2));
            return createdDisk;
        }).catch((error: Error) => {
            console.error("Error creating disk:", JSON.stringify(disk, null, 2), "Error:", error);
            throw error;
        });
    }));
};


async function createHost({ hostname, ip, osName, osVersion, cpuCores, memory, status, gateway, dhcp, macAddress, networkServices, systemServices, userAccounts, disks, cpuName }: HostData) {

    // Create OS records
    const os = {
        name: osName,
        version: osVersion,
    };

    const createdOS = await prisma.OS.create({ data: os });

    // Create SystemSpec records
    const systemInfo = {
        cpuCores,
        memory,
        cpuName
    };

    const createdSystemInfo = await prisma.systemInfo.create({ data: systemInfo });

    // Create Host record
    const host = {
        hostname,
        ip,
        os: { connect: { id: createdOS.id } },
        systemInfo: { connect: { id: createdSystemInfo.id } },
        status,
        gateway,
        dhcp,
        macAddress,
    };

    const createdHost = await prisma.host.create({ data: host });

    // Create related records for the host's services
    if (networkServices && networkServices.length > 0) {
        await createNetworkServices(networkServices, createdHost.id);
    }

    if (systemServices && systemServices.length > 0) {
        await createSystemServices(systemServices, createdHost.id);
    }

    if (userAccounts && userAccounts.length > 0) {
        await createUserAccounts(userAccounts, createdHost.id);
    }

    if (disks && disks.length > 0) {
        await createDisks(disks, createdHost.id);
    }

    // Additional data creation (software, containers, volumes) can be added here if needed

    return createdHost;
}

async function main() {
    const host1NetworkServices: NetworkServiceTypes[] = [
        {
            name: 'SMB',
            port: 445, // SMB typically uses port 445
            description: 'Server Message Block for file sharing',
            status: 'OPEN',
        },
        {
            name: 'IIS',
            port: 80,
            description: 'Internet Information Services',
            status: 'OPEN',
        },
        {
            name: 'MSSQL',
            port: 1433,
            description: 'Microsoft SQL Server database service',
            status: 'CLOSED',
        }
    ];

    const host1SystemServices: SystemServiceTypes[] = [
        {
            name: 'systemd',
            description: 'System and Service Manager',
            status: 'RUNNING',
        },
        {
            name: 'cron',
            description: 'Cron Job Scheduler',
            status: 'RUNNING',
        },
        {
            name: 'rsyslog',
            description: 'Logging Service',
            status: 'RUNNING',
        }
    ];

    const host1UserAccounts: UserAccountTypes[] = [
        {
            name: 'root',
            password: 'password123',
            userType: 'PRIVILEGED',
            gid: '10',
            uid: '20',
            isLocal: true,
        },
        {
            name: 'kevin',
            password: 'password123',
            userType: 'USER',
            gid: '10',
            uid: '20',
            isLocal: true,
        },
        {
            name: 'bruce',
            password: 'password123',
            userType: 'USER',
            gid: '10',
            uid: '20',
            isLocal: true,
        },
    ];

    const host1Disks: Disk[] = [
        {
            name: "/dev/nvme1n1p3",
            mountPoint: "/",
            filesystem: "btrfs",
            totalSpace: 975137,
            availableSpace: 590249
        },
        {
            name: "/dev/nvme1n1p3",
            mountPoint: "/home",
            filesystem: "btrfs",
            totalSpace: 975137,
            availableSpace: 590249
        },
        {
            name: "/dev/nvme1n1p2",
            mountPoint: "/boot",
            filesystem: "ext4",
            totalSpace: 973,
            availableSpace: 603
        },
        {
            name: "/dev/nvme1n1p1",
            mountPoint: "/boot/efi",
            filesystem: "vfat",
            totalSpace: 598,
            availableSpace: 539,
        }
    ];


    const host2NetworkServices: NetworkServiceTypes[] = [
        {
            name: 'sshd',
            port: 22,
            description: 'SSH Daemon',
            status: 'OPEN',
        },
        {
            name: 'Apache',
            port: 80,
            description: 'Web Server',
            status: 'OPEN',
        },
        {
            name: 'MySQL',
            port: 3306,
            description: 'MySQL Database Service',
            status: 'FILTERED',
        }
    ];

    const host2SystemServices: SystemServiceTypes[] = [
        {
            name: 'WSearch',
            description: 'Windows Search Service',
            status: 'RUNNING',
        },
        {
            name: 'WinDefend',
            description: 'Windows Defender Service',
            status: 'RUNNING',
        },
        {
            name: 'wuauserv',
            description: 'Windows Update Service',
            status: 'STOPPED',
        }
    ];

    const host2UserAccounts: UserAccountTypes[] = [
        {
            name: 'administrator',
            password: 'password123',
            userType: 'PRIVILEGED',
            gid: '10',
            uid: '20',
            isLocal: true,
        },
        {
            name: 'lupe',
            password: 'password123',
            userType: 'USER',
            gid: '10',
            uid: '20',
            isLocal: true,
        },
        {
            name: 'hector',
            password: 'password123',
            userType: 'USER',
            gid: '10',
            uid: '20',
            isLocal: true,
        },
    ];

    const host2Disks: Disk[] = [
        {
            name: "/dev/nvme1n1p3",
            mountPoint: "/",
            filesystem: "btrfs",
            totalSpace: 975137,
            availableSpace: 590249
        },
        {
            name: "/dev/nvme1n1p3",
            mountPoint: "/home",
            filesystem: "btrfs",
            totalSpace: 975137,
            availableSpace: 590249
        },
        {
            name: "/dev/nvme1n1p2",
            mountPoint: "/boot",
            filesystem: "ext4",
            totalSpace: 973,
            availableSpace: 603
        },
        {
            name: "/dev/nvme1n1p1",
            mountPoint: "/boot/efi",
            filesystem: "vfat",
            totalSpace: 598,
            availableSpace: 539,
        }
    ];
    
    const host1 = await createHost({
        hostname: 'bobby',
        ip: '192.168.60.253',
        osName: 'Linux',
        osVersion: 'Ubuntu 20.04',
        cpuCores: 4,
        cpuName: '13th Gen Intel(R) Core(TM) i9-13900HX',
        memory: 8192,
        disks: host1Disks,
        status: 'UP',
        gateway: '192.168.60.1',
        dhcp: true,
        macAddress: '00:1A:2B:3C:4D:5E',
        networkServices: host1NetworkServices,
        systemServices: host1SystemServices,
        userAccounts: host1UserAccounts,
    });

    const host2 = await createHost({
        hostname: 'shmurda',
        ip: '192.168.60.254',
        osName: 'Windows',
        osVersion: 'Windows 10 Pro',
        cpuCores: 8,
        memory: 931712,
        cpuName: '13th Gen Intel(R) Core(TM) i9-13900HX',
        disks: host2Disks,
        status: 'UP',
        gateway: '192.168.60.1',
        dhcp: true,
        macAddress: '56:78:9A:BC:DE:F0',
        networkServices: host2NetworkServices,
        systemServices: host2SystemServices,
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
