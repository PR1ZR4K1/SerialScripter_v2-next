const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { Prisma } from '@prisma/client';
import { createHost, ModifiedUserAccountType, ModifiedNetworkServiceType, ModifiedConnectionType, ExtendedContainerType } from '../src/lib/prismaHelper';

async function main() {
    const host1NetworkServices: ModifiedNetworkServiceType[] = [
        {
            "port": 1024,
            "protocol": "UDP",
            "process": {    
                "pid": 255467,
                "name": "nginx",
            },
            "version": "1.18.0",
            "state": "established"
        },
        {
            "port": 8080,
            "protocol": "TCP",
            "process": {    
                "pid": 467290,
                "name": "apache2",
            },
            "version": "2.4.46",
            "state": "closed"
        },
        {
            "port": 3306,
            "protocol": "TCP",
            "process": {    
                "pid": 182034,
                "name": "mysqld",
            },
            "version": "8.0.22",
            "state": "listen"
        }
    ];

    const host1SystemServices: Prisma.SystemServiceCreateManyHostInput[] = [
        {
            name: 'systemd',
            startMode: 'Enabled',
            state: 'loaded',
            status: 'active',
        },
        {
            name: 'cron',
            startMode: 'Enabled',
            state: 'loaded',
            status: 'inactive',
        },
        {
            name: 'rsyslog',
            startMode: 'Enabled',
            state: 'loaded',
            status: 'active',
        }
    ];

    const host1UserAccounts: ModifiedUserAccountType[] = [
        {
            name: 'root',
            isAdmin: true,
            gid: '10',
            uid: '20',
            isLocal: true,
            shell: '/bin/bash',
            groups: ['root', 'sudo', 'admin']
        },
        {
            name: 'kevin',
            isAdmin: false,
            gid: '10',
            uid: '20',
            isLocal: true,
            shell: '/bin/bash',
            groups: ['root', 'sudo', 'admin'],
        },
        {
            name: 'bruce',
            isAdmin: false,
            gid: '10',
            uid: '20',
            isLocal: true,
            shell: '/bin/bash',
            groups: ['root', 'sudo', 'admin'],
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

    const host1Connections: ModifiedConnectionType[] = [
        {
            "localAddress": "0.0.0.0:5355",
            "remoteAddress": "0.0.0.0:0",
            "state": "listen",
            "protocol": "TCP",
            "process": {
                "pid": 352583,
                "name": "systemd-resolve"
            }
        },
        {
            "localAddress": "127.0.0.1:631",
            "remoteAddress": "0.0.0.0:0",
            "state": "listen",
            "protocol": "TCP",
            "process": {
                "pid": 1580,
                "name": "cupsd"
            }
        },
        {
            "localAddress": "127.0.2.3:53",
            "remoteAddress": "0.0.0.0:0",
            "state": "listen",
            "protocol": "TCP",
            "process": {
                "pid": 1348,
                "name": "warp-svc"
           }
        },
    ];

    const host1Shares: Prisma.ShareCreateManyHostInput[] = [
        {
            "shareType": "nFS",
            "networkPath": "/var/nfs1"
        },
        {
            "shareType": "sMB",
            "networkPath": "/var/smb1"
        },
        {
            "shareType": "nFS",
            "networkPath": "/var/nfs2"
        },
        {
            "shareType": "sMB",
            "networkPath": "/var/smb2"
        },
        {
            "shareType": "nFS",
            "networkPath": "/var/nfs3"
        }
    ];

    const host1FirewallRules: Prisma.FirewallRuleCreateManyHostInput[] = [
        {'action': 'accept', 'dport': 22, 'protocol': 'tcp'},
        {'action': 'accept', 'dport': 80, 'protocol': 'tcp'}, 
        {'action': 'drop', 'dport': 1000, 'protocol': 'tcp'},
    ]

    const host2NetworkServices: ModifiedNetworkServiceType[] = [
        {
            "port": 22,
            "protocol": "TCP",
            "process": {    
                "pid": 94177,
                "name": "sshd",
            },
            "version": "8.4p1",
            "state": "established"
        },
        {
            "port": 443,
            "protocol": "TCP",
            "process": {    
                "pid": 48763,
                "name": "httpd",
            },
            "version": "2.4.43",
            "state": "listen"
        },
        {
            "port": 53,
            "protocol": "UDP",
            "process": {    
                "pid": 337211,
                "name": "named",
            },
            "version": "9.16",
            "state": "established"
        }

    ];

    const host2SystemServices: Prisma.SystemServiceCreateManyHostInput[] = [
        {
            name: 'WSearch',
            startMode: 'Enabled',
            state: 'loaded',
            status: 'active',
        },
        {
            name: 'WinDefend',
            startMode: 'Enabled',
            state: 'loaded',
            status: 'unknown',
        },
        {
            name: 'wuauserv',
            startMode: 'Enabled',
            state: 'loaded',
            status: 'inactive',
        },
        {
            name: 'alsdfh',
            startMode: 'Enabled',
            state: 'loaded',
            status: 'failed',
        }
    ];

    const host2UserAccounts: ModifiedUserAccountType[] = [
        {
            name: 'administrator',
            isAdmin: true,
            gid: '10',
            uid: '20',
            isLocal: true,
            shell: 'pwsh.exe', 
            groups: ['Administrators', 'Users', 'Guests']
        },
        {
            name: 'lupe',
            isAdmin: false,
            gid: '10',
            uid: '20',
            isLocal: true,
            shell: 'pwsh.exe', 
            groups: ['Administrators', 'Users', 'Guests'],
        },
        {
            name: 'hector',
            isAdmin: false,
            gid: '10',
            uid: '20',
            isLocal: true,
            shell: 'pwsh.exe', 
            groups: ['Administrators', 'Users', 'Guests'],
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

    const host2Connections: ModifiedConnectionType[] = [
        {
            "localAddress": "127.0.0.1:6463",
            "remoteAddress": "0.0.0.0:0",
            "state": "listen",
            "protocol": "TCP",
            "process": {
                "pid": 53396,
                "name": "Discord"
            }
        },
        {
            "localAddress": "127.0.0.54:53",
            "remoteAddress": "0.0.0.0:0",
            "state": "listen",
            "protocol": "TCP",
            "process": {
                "pid": 352583,
                "name": "systemd-resolve"
            }
        },
        {
            "localAddress": "127.0.0.53:53",
            "remoteAddress": "0.0.0.0:0",
            "state": "listen",
            "protocol": "TCP",
            "process": {
                "pid": 352583,
                "name": "systemd-resolve"
            }
        },
    ];

    const host2Shares: Prisma.ShareCreateManyHostInput[] = [
        {
            "shareType": "sMB",
            "networkPath": "/var/smb3"
        },
        {
            "shareType": "nFS",
            "networkPath": "/var/nfs4"
        },
        {
            "shareType": "sMB",
            "networkPath": "/var/smb4"
        },
        {
            "shareType": "nFS",
            "networkPath": "/var/nfs5"
        },
        {
            "shareType": "sMB",
            "networkPath": "/var/smb5"
        }
    ];

    const host2Containers: ExtendedContainerType[] = [
    {
      "containerId": "65680f10810410642c109dd26fd37cfe06da9d26ad7c20fda5eecce689d5e371",
      "name": "/stoic_darwin",
      "containerNetworks": [
        {
          "networkName": "host",
          "ip": "10.10.69.420",
          "gateway": "0.0.0.0",
          "macAddress": "lalalaal"
        }
      ],
      "portBindings": ['12', '22'],
      "containerVolumes": [
        {
          "hostPath": "/var/lib/docker/volumes/test/_data",
          "containerPath": "/home/root",
          "mode": "z",
          "volumeName": "test",
          "rw": true,
          "vType": "volume"
        }
      ],
      "status": "running",
      "cmd": "/bin/bash"
    }
  ]
    
    const host1 = await createHost({
        hostname: 'bobby',
        ip: '192.168.60.253',
        os: 'Linux',
        version: 'Ubuntu 20.04',
        cores: 4,
        cpu: '13th Gen Intel(R) Core(TM) i9-13900HX',
        memory: 8192,
        disks: host1Disks,
        status: 'UP',
        gateway: '192.168.60.1',
        dhcp: true,
        macAddress: '00:1A:2B:3C:4D:5E',
        ports: host1NetworkServices,
        services: host1SystemServices,
        users: host1UserAccounts,
        connections: host1Connections,
        shares: host1Shares, 
        firewallRules: host1FirewallRules,
    });

    const host2 = await createHost({
        hostname: 'shmurda',
        ip: '192.168.60.254',
        os: 'Windows',
        version: 'Windows 10 Pro',
        cores: 8,
        memory: 931712,
        cpu: '13th Gen Intel(R) Core(TM) i9-13900HX',
        disks: host2Disks,
        status: 'UP',
        gateway: '192.168.60.1',
        dhcp: true,
        macAddress: '56:78:9A:BC:DE:F0',
        ports: host2NetworkServices,
        services: host2SystemServices,
        users: host2UserAccounts,
        connections: host2Connections,
        shares: host2Shares,
        containers: host2Containers,
    });

    // Additional hosts can be created in a similar way

    console.log('Hosts created:', host1, host2);

    await prisma.API_KEYS.create({
        data: {
            albertosFunKey: '440e585a2a08a4e5b2bef11d3469e6538491cfaec0d3f9a139d8db022e59a03bfd6095f25f876eae7a8689574c2e2687fb4b5c892e238f677b9af81785404703',
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
