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

export async function upsertItem<T, U extends HostConnect | ContainerConnect>(
    items: T[],
    connectData: U,
    upsertFunction: (item: T & U, whereCondition: any) => Promise<any>,
    whereConditionFunction: (item: T) => any
) {
    return Promise.all(
        items.map(item => {
            const itemWithConnect = { ...item, ...connectData };
            const whereCondition = whereConditionFunction(item);
            return upsertFunction(itemWithConnect as any, whereCondition);
        })
    );
}

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
    users?: Prisma.UserAccountCreateManyHostInput[];
    connections?: Prisma.ConnectionCreateManyHostInput[];
    shares?: Prisma.ShareCreateManyHostInput[];
    containers?: ExtendedContainerType[];
    firewallRules?: Prisma.FirewallRuleCreateManyHostInput[];
}

export async function createHost(hostData: HostData) {
    // Create Host record
    const host = {
        hostname: hostData.hostname,
        ip: hostData.ip,
        os: hostData.os,
        cpu: hostData.cpu,
        cores: hostData.cores,
        memory: hostData.memory,
        version: hostData.version,
        status: hostData.status,
        gateway: hostData.gateway,
        dhcp: hostData.dhcp,
        macAddress: hostData.macAddress,
    };

    const createdHost = await prisma.host.upsert({
        where: { hostname_ip: { hostname: host.hostname, ip: host.ip } },
        create: host,
        update: host,
    });

    // Create related records for the host's services
    if (hostData.ports && hostData.ports.length > 0) {
        // await createNetworkServices(hostData.ports, createdHost.id);
        await upsertItem<ModifiedNetworkServiceType, HostConnect>(
            hostData.ports.map(flattenProcesses),
            createHostConnect(createdHost.id),
            (service, whereCondition) => prisma.networkService.upsert({ where: whereCondition, create: service as Prisma.NetworkServiceCreateInput, update: service as Prisma.NetworkServiceUpdateInput }),
            (service) => ({ port_hostId: { port: service.port, hostId: createdHost.id } }) // where condition
        );

        //await processArray<ModifiedNetworkServiceType, HostConnect>( hostData.ports.map(flattenProcesses), 
        //  createHostConnect(createdHost.id),
        // (service) => prisma.networkService.create({ data: service as Prisma.NetworkServiceCreateInput }));
    }

    if (hostData.services && hostData.services.length > 0) {
        // await createSystemServices(hostData.services, createdHost.id);
        await upsertItem<Prisma.SystemServiceCreateManyHostInput, HostConnect>(
            hostData.services,
            createHostConnect(createdHost.id),
            (service, whereCondition) => prisma.systemService.upsert({ where: whereCondition, create: service as Prisma.SystemServiceCreateInput, update: service as Prisma.SystemServiceUpdateInput }),
            (service) => ({ name_hostId: { name: service.name, hostId: createdHost.id } }) // where condition
        );
    }

    if (hostData.users && hostData.users.length > 0) {
        // await createUserAccounts(hostData.users, createdHost.id);
        // Example usage with Prisma's UserAccount type
        await upsertItem<ModifiedUserAccountType, HostConnect>(
            hostData.users,
            createHostConnect(createdHost.id),
            (user, whereCondition) => prisma.userAccount.upsert({ where: whereCondition, create: user as Prisma.UserAccountCreateInput, update: user as Prisma.UserAccountUpdateInput }),
            (user) => ({ name_hostId: { name: user.name, hostId: createdHost.id } }) // where condition
        );
    }

    if (hostData.disks && hostData.disks.length > 0) {
        // await createDisks(hostData.disks, createdHost.id);
        await upsertItem<Prisma.DiskCreateManyHostInput, HostConnect>(
            hostData.disks,
            createHostConnect(createdHost.id),
            (disk, whereCondition) => prisma.disk.upsert({ where: whereCondition, create: disk as Prisma.DiskCreateInput, update: disk as Prisma.DiskUpdateInput }),
            (disk) => ({ mountPoint_hostId: { mountPoint: disk.mountPoint, hostId: createdHost.id } }) // where condition
        );
    }

    if (hostData.connections && hostData.connections.length > 0) {
        // await createConnections(hostData.connections, createdHost.id);

        await upsertItem<ModifiedConnectionType, HostConnect>(
            hostData.connections.map(flattenProcesses),
            createHostConnect(createdHost.id),
            (connection, whereCondition) => prisma.connection.upsert({ where: whereCondition, create: connection as Prisma.ConnectionCreateInput, update: connection as Prisma.ConnectionUpdateInput }),
            (connection) => ({ localAddress_remoteAddress_hostId: { localAddress: connection.localAddress, remoteAddress: connection.remoteAddress, hostId: createdHost.id } }) // where condition
        );
    }

    if (hostData.firewallRules && hostData.firewallRules.length > 0) {
        // await createShares(hostData.firewallRules, createdHost.id);
        await upsertItem<Prisma.FirewallRuleCreateManyHostInput, HostConnect>(
            hostData.firewallRules,
            createHostConnect(createdHost.id),
            (rule, whereCondition) => prisma.firewallRule.upsert({ where: whereCondition, create: rule as Prisma.FirewallRuleCreateInput, update: rule as Prisma.FirewallRuleUpdateInput }),
            (rule) => ({ dport_hostId: { dport: rule.dport, hostId: createdHost.id } }) // where condition
        );
    }
    // const createdContainer = prisma.container.create({ data: {...container, hostId: hostId,} });


    if (hostData.shares && hostData.shares.length > 0) {
        // await createShares(hostData.shares, createdHost.id);
        await upsertItem<Prisma.ShareCreateManyHostInput, HostConnect>(
            hostData.shares,
            createHostConnect(createdHost.id),
            (share, whereCondition) => prisma.share.upsert({ where: whereCondition, create: share as Prisma.ShareCreateInput, update: share as Prisma.ShareUpdateInput }),
            (share) => ({ networkPath_hostId: { networkPath: share.networkPath, hostId: createdHost.id } }) // where condition
        );
    }

    if (hostData.containers && hostData.containers.length > 0) {
        // await createContainers(hostData.containers, createdHost.id);
        for (const containers of hostData.containers) {
            const { containerNetworks, containerVolumes, ...container } = containers;
            await createContainer(createdHost.id, container, containerNetworks || [], containerVolumes || []);
        }
    }

    // Additional data creation (software, containers, volumes) can be added here if needed
    return createdHost;
}

async function createContainer(hostid: number, container: Prisma.ContainerCreateInput, containerNetworks: Prisma.ContainerNetworkCreateInput[], containerVolumes: Prisma.ContainerVolumeCreateInput[]) {
    const containerWithHost = { ...container, host: { connect: { id: hostid } } };


    const { id } = await prisma.container.upsert({
        where: { containerId_hostId: { containerId: container.containerId, hostId: hostid } },
        create: containerWithHost as Prisma.ContainerCreateInput,
        update: containerWithHost as Prisma.ContainerUpdateInput,
    });

    await upsertItem<Prisma.ContainerNetworkCreateInput, ContainerConnect>(
        containerNetworks,
        createContainerConnect(id),
        (network, whereCondition) => prisma.containerNetwork.upsert({ where: whereCondition, create: network as Prisma.ContainerNetworkCreateInput, update: network as Prisma.ContainerNetworkUpdateInput }),
        (network) => ({ networkName_containerId: { networkName: network.networkName, containerId: id } }) // where condition
    );

    await upsertItem<Prisma.ContainerVolumeCreateInput, ContainerConnect>(
        containerVolumes,
        createContainerConnect(id),
        (volume, whereCondition) => prisma.containerVolume.upsert({ where: whereCondition, create: volume as Prisma.ContainerVolumeCreateInput, update: volume as Prisma.ContainerVolumeUpdateInput }),
        (volume) => ({ volumeName_containerId: { volumeName: volume.volumeName, containerId: id } }) // where condition
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
