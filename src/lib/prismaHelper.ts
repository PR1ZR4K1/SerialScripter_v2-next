import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

export type HostConnect = {
    host: { connect: { id: number } };
};

type ContainerConnect = {
    container: { connect: { id: number } };
};

export const createHostConnect = (id: number) => ({ host: { connect: { id } } });
const createContainerConnect = (id: number) => ({ container: { connect: { id } } });

export async function processArray<T, U extends HostConnect | ContainerConnect>(
    items: T[], 
    connectData: U, 
    createFunction: (item: T & U) => Promise<any>
) {
    return Promise.all(
        items.map(item => {
            const itemWithConnect = { ...item, ...connectData };
            return createFunction(itemWithConnect as any);
        })
    );
}

export type ModifiedUserAccountType = Omit<Prisma.UserAccountCreateInput, 'userType'> & {
    isAdmin: boolean;
};

type ProcessType = {
    name: string;
    pid: number;
}

export type ModifiedNetworkServiceType = Omit<Prisma.NetworkServiceCreateManyHostInput, 'name' | 'pid'> & {
    process?: ProcessType;
};

export type ModifiedConnectionType = Omit<Prisma.ConnectionCreateManyHostInput, 'name' | 'pid'> & {   
    process: ProcessType;
};

export type ExtendedContainerType = Prisma.ContainerCreateManyHostInput & {
    containerNetworks?: Prisma.ContainerNetworkCreateInput[];
    containerVolumes?: Prisma.ContainerVolumeCreateInput[];
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
    users?:   Prisma.UserAccountCreateManyHostInput[];
    connections?: Prisma.ConnectionCreateManyHostInput[];
    shares?: Prisma.ShareCreateManyHostInput[];
    containers?: ExtendedContainerType[];
    firewallRules?: Prisma.FirewallRuleCreateManyHostInput[];
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
        // await createNetworkServices(hostData.ports, createdHost.id);
        await processArray<ModifiedNetworkServiceType, HostConnect>( hostData.ports.map(flattenProcesses), 
            createHostConnect(createdHost.id),
            (service) => prisma.networkService.create({ data: service as Prisma.NetworkServiceCreateInput }));
    }

    if (hostData.services && hostData.services.length > 0) {
        // await createSystemServices(hostData.services, createdHost.id);
        await processArray<Prisma.SystemServiceCreateInput, HostConnect>(
            hostData.services, 
            createHostConnect(createdHost.id),
            (service) => prisma.systemService.create({ data: service as Prisma.SystemServiceCreateInput })
        );
    }

    if (hostData.users && hostData.users.length > 0) {
        // await createUserAccounts(hostData.users, createdHost.id);
        // Example usage with Prisma's UserAccount type
        await processArray<Prisma.UserAccountCreateInput, HostConnect>(
            hostData.users, 
            createHostConnect(createdHost.id),
            (userAccount) => prisma.userAccount.create({ data: userAccount as Prisma.UserAccountCreateInput })
        );
    }

    if (hostData.disks && hostData.disks.length > 0) {
        // await createDisks(hostData.disks, createdHost.id);
        await processArray<Prisma.DiskCreateInput, HostConnect>(
            hostData.disks, 
            createHostConnect(createdHost.id),
            (disk) => prisma.disk.create({ data: disk as Prisma.DiskCreateInput })
        );
    }

    if (hostData.connections && hostData.connections.length > 0) {
        // await createConnections(hostData.connections, createdHost.id);
        await processArray<ModifiedConnectionType, HostConnect>(
            hostData.connections.map(flattenProcesses), 
            createHostConnect(createdHost.id),
            (connection) => prisma.connection.create({ data: connection as Prisma.ConnectionCreateInput })
        );
    }

    if (hostData.firewallRules && hostData.firewallRules.length > 0) {
        // await createShares(hostData.firewallRules, createdHost.id);
        await processArray<Prisma.FirewallRuleCreateInput, HostConnect>(
            hostData.firewallRules, 
            createHostConnect(createdHost.id),
            (firewallRule) => prisma.firewallRule.create({ data: firewallRule as Prisma.FirewallRuleCreateInput })
        );
    }
// const createdContainer = prisma.container.create({ data: {...container, hostId: hostId,} });


    if (hostData.shares && hostData.shares.length > 0) {
        // await createShares(hostData.shares, createdHost.id);
        await processArray<Prisma.ShareCreateInput, HostConnect>(
            hostData.shares, 
            createHostConnect(createdHost.id),
            (share) => prisma.share.create({ data: share as Prisma.ShareCreateInput })
        );
    }

    if (hostData.containers && hostData.containers.length > 0) {
        // await createContainers(hostData.containers, createdHost.id);
        for (const containers of hostData.containers) {
            const {containerNetworks, containerVolumes, ...container} = containers;
            await createContainer(createdHost.id, container, containerNetworks || [], containerVolumes || []);
        }
    }

    // Additional data creation (software, containers, volumes) can be added here if needed
    return createdHost;
}

async function createContainer(hostid: number, container: Prisma.ContainerCreateInput, containerNetworks: Prisma.ContainerNetworkCreateInput[], containerVolumes: Prisma.ContainerVolumeCreateInput[]) {
    const containerWithHost = { ...container, host: { connect: { id: hostid } } };
    const {id} = await prisma.container.create({data: containerWithHost as Prisma.ContainerCreateInput});

    await processArray<Prisma.ContainerNetworkCreateInput, ContainerConnect>(
        containerNetworks, 
        createContainerConnect(id),
        (network) => prisma.containerNetwork.create({ data: network as Prisma.ContainerNetworkCreateInput })
    ); 

    await processArray<Prisma.ContainerVolumeCreateInput, ContainerConnect>(
        containerVolumes, 
        createContainerConnect(id),
        (volume) => prisma.containerVolume.create({ data: volume as Prisma.ContainerVolumeCreateInput })
    ); 
    
}

function flattenProcesses(connection: any) {
    if (connection.process === null) {
        delete connection.process;
        return connection;
    }

    const { name, pid } = connection.process;

    if (connection.process) 
        delete connection.process;

    return {
        ...connection,
        name: name || '',
        pid: pid || 0,
    };
}