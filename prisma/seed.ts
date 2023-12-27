const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { Prisma } from '@prisma/client';
import { createHost } from '../src/lib/prismaHelper';

async function main() {
    const host1NetworkServices: Prisma.NetworkServiceCreateManyHostInput[] = [
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

    const host1SystemServices: Prisma.SystemServiceCreateManyHostInput[] = [
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

    const host1UserAccounts: Prisma.UserAccountCreateInput[] = [
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

    const host1Disks: Prisma.DiskCreateManyHostInput[] = [
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


    const host2NetworkServices: Prisma.NetworkServiceCreateManyHostInput[] = [
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

    const host2SystemServices: Prisma.SystemServiceCreateManyHostInput[] = [
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

    const host2UserAccounts: Prisma.UserAccountCreateInput[] = [
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

    const host2Disks: Prisma.DiskCreateManyHostInput[] = [
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
        cores: 4,
        cpu: '13th Gen Intel(R) Core(TM) i9-13900HX',
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
        cores: 8,
        memory: 931712,
        cpu: '13th Gen Intel(R) Core(TM) i9-13900HX',
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

    await prisma.API_KEYS.create({
        data: {
            key: process.env.API_KEY,
            lifetime: 10,
        },
    });

    console.log('API Table created!')
}

main()
    .catch(e => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
