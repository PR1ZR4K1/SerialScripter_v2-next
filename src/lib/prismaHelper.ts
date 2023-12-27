import { prisma } from './prisma';
import { Prisma } from '@prisma/client';


async function createUserAccounts(userAccounts: ModifiedUserAccountType[], hostId: number) {
    return Promise.all(userAccounts.map(userAccount => 
        prisma.userAccount.create({
            data: {
                name: userAccount.name,
                userType: (userAccount.isAdmin ? 'PRIVILEGED' : 'USER'), // Correct field name as per schema
                isLocal: userAccount.isLocal,
                uid: userAccount.uid,
                gid: userAccount.gid,
                groups: userAccount.groups,
                shell: userAccount.shell || '',
                hostId: hostId, // Link each user account to the created host
            },
        })
    ));
};

async function createNetworkServices(services: ModifiedNetworkServiceType[], hostId: number) {
    return Promise.all(services.map(service => 
        prisma.networkService.create({
            data: {
                name: service.process.name,
                port: service.port,
                state: service.state,
                protocol: service.protocol,
                version: service.version,
                pid: service.process.pid,
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
                state: service.state,
                startMode: service.startMode || '',
                status: service.status,
                hostId: hostId, // Link each service to the created host
            },
        })
    ));
};

async function createDisks(disks: Prisma.DiskCreateManyHostInput[], hostId: number) {

    return Promise.all(disks.map(disk => {

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

async function createConnections(connections: ModifiedConnectionsType[], hostId: number) {

    return Promise.all(connections.map(connection => {
        return prisma.connections.create({
            data: {
                name: connection.process.name,
                localAddress: connection.localAddress,
                remoteAddress: connection.remoteAddress,
                pid: connection.process.pid,
                protocol: connection.protocol,
                state: connection.state,
                hostId: hostId,
            },
        });
    }));
};

export type ModifiedUserAccountType = Omit<Prisma.UserAccountCreateInput, 'userType'> & {
    isAdmin: boolean;
};

type ProcessType = {
    name: string;
    pid: number;
}

export type ModifiedNetworkServiceType = Omit<Prisma.NetworkServiceCreateManyHostInput, 'name' | 'pid'> & {
    process: ProcessType;
};

export type ModifiedConnectionsType = Omit<Prisma.ConnectionsCreateManyHostInput, 'name' | 'pid'> & {   
    process: ProcessType;
};

interface HostData {
    hostname: string;
    ip: string;
    os: string;
    version: string;
    cores: number;
    cpu: string;
    memory: number;
    status?: 'UP' | 'DOWN'; // Update with appropriate status values
    gateway?: string,
    dhcp?: boolean,
    macAddress?: string;
    disks?: Prisma.DiskCreateManyHostInput[];
    services?: Prisma.SystemServiceCreateManyHostInput[];
    ports?: ModifiedNetworkServiceType[];
    users?:   ModifiedUserAccountType[];
    connections?: ModifiedConnectionsType[];
}

export async function createHost(hostData : HostData) {

    // Create OS records
    const os = {
        name: hostData.os,
        version: hostData.version,
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
    if (hostData.ports && hostData.ports.length > 0) {
        await createNetworkServices(hostData.ports, createdHost.id);
    }

    if (hostData.services && hostData.services.length > 0) {
        await createSystemServices(hostData.services, createdHost.id);
    }

    if (hostData.users && hostData.users.length > 0) {
        await createUserAccounts(hostData.users, createdHost.id);
    }

    if (hostData.disks && hostData.disks.length > 0) {
        await createDisks(hostData.disks, createdHost.id);
    }

    if (hostData.connections && hostData.connections.length > 0) {
        await createConnections(hostData.connections, createdHost.id);
    }

    // Additional data creation (software, containers, volumes) can be added here if needed
    return createdHost;
}