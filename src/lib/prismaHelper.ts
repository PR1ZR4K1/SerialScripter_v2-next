import { prisma } from './prisma';
import { Prisma } from '@prisma/client';


async function createUserAccounts(userAccounts: Prisma.UserAccountCreateManyHostInput[], hostId: number) {
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

async function createNetworkServices(services: Prisma.NetworkServiceCreateManyHostInput[], hostId: number) {
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

async function createSystemServices(services: Prisma.SystemServiceCreateManyHostInput[], hostId: number) {
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

async function createDisks(disks: Prisma.DiskCreateManyHostInput[], hostId: number) {
    console.log("Creating disks for hostId:", hostId);
    console.log("Disks to create:", JSON.stringify(disks, null, 2));

    return Promise.all(disks.map(disk => {
        console.log("Creating disk:", JSON.stringify(disk, null, 2));

        return prisma.disk.create({
            data: {
                name: disk.name,
                mountPoint: disk.mountPoint,
                filesystem: disk.filesystem,
                totalSpace: disk.totalSpace,
                availableSpace: disk.availableSpace,
                hostId: hostId,
            },
        });
    }));
};

interface HostData {
    hostname: string;
    ip: string;
    osName: string;
    osVersion: string;
    cores: number;
    cpu: string;
    memory: number;
    status?: 'UP' | 'DOWN'; // Update with appropriate status values
    gateway?: string,
    dhcp?: boolean,
    macAddress?: string;
    disks?: Prisma.DiskCreateManyHostInput[];
    systemServices?: Prisma.SystemServiceCreateManyHostInput[];
    networkServices?: Prisma.NetworkServiceCreateManyHostInput[];
    userAccounts?:   Prisma.UserAccountCreateInput[];
}

export async function createHost(hostData : HostData) {

    // Create OS records
    const os = {
        name: hostData.osName,
        version: hostData.osVersion,
    };

    const createdOS = await prisma.oS.create({ data: os });

    // Create SystemSpec records
    const systemInfo = {
        cpuCores: hostData.cores,
        memory: hostData.memory,
        cpuName: hostData.cpu,
    };

    const createdSystemInfo = await prisma.systemInfo.create({ data: systemInfo });

    // Create Host record
    const host = {
        hostname: hostData.hostname,
        ip: hostData.ip,
        os: { connect: { id: createdOS.id } },
        systemInfo: { connect: { id: createdSystemInfo.id } },
        status: hostData.status,
        gateway: hostData.gateway,
        dhcp: hostData.dhcp,
        macAddress: hostData.macAddress,
    };

    const createdHost = await prisma.host.create({ data: host });

    // Create related records for the host's services
    if (hostData.networkServices && hostData.networkServices.length > 0) {
        await createNetworkServices(hostData.networkServices, createdHost.id);
    }

    if (hostData.systemServices && hostData.systemServices.length > 0) {
        await createSystemServices(hostData.systemServices, createdHost.id);
    }

    if (hostData.userAccounts && hostData.userAccounts.length > 0) {
        await createUserAccounts(hostData.userAccounts, createdHost.id);
    }

    if (hostData.disks && hostData.disks.length > 0) {
        await createDisks(hostData.disks, createdHost.id);
    }

    // Additional data creation (software, containers, volumes) can be added here if needed
    return createdHost;
}