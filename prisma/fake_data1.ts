const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { Prisma } from '@prisma/client';
import { createHost, ModifiedUserAccountType, ModifiedNetworkServiceType, ModifiedConnectionType, ExtendedContainerType } from '../src/lib/prismaHelper';
import { hash } from 'bcrypt';

async function main() {
    // Common disk configuration
    const standardLinuxDisks: Prisma.DiskCreateManyHostInput[] = [
        {
            name: "/dev/sda1",
            mountPoint: "/",
            filesystem: "ext4",
            totalSpace: 975137,
            availableSpace: 590249
        },
        {
            name: "/dev/sda2",
            mountPoint: "/home",
            filesystem: "ext4",
            totalSpace: 487568,
            availableSpace: 295124
        },
        {
            name: "/dev/sda3",
            mountPoint: "/var",
            filesystem: "ext4",
            totalSpace: 243784,
            availableSpace: 147892
        }
    ];

    const standardWindowsDisks: Prisma.DiskCreateManyHostInput[] = [
        {
            name: "C:",
            mountPoint: "C:",
            filesystem: "NTFS",
            totalSpace: 975137,
            availableSpace: 590249
        },
        {
            name: "D:",
            mountPoint: "D:",
            filesystem: "NTFS",
            totalSpace: 487568,
            availableSpace: 295124
        }
    ];

    // Linux Web Server
    const webServerNetworkServices: ModifiedNetworkServiceType[] = [
        {
            port: 80,
            protocol: "TCP",
            process: {
                pid: 12345,
                name: "nginx"
            },
            version: "1.18.0",
            state: "listen"
        },
        {
            port: 443,
            protocol: "TCP",
            process: {
                pid: 12346,
                name: "nginx"
            },
            version: "1.18.0",
            state: "listen"
        }
    ];

    const webServerServices: Prisma.SystemServiceCreateManyHostInput[] = [
        {
            name: 'nginx',
            startMode: 'Enabled',
            state: 'loaded',
            status: 'active'
        },
        {
            name: 'php-fpm',
            startMode: 'Enabled',
            state: 'loaded',
            status: 'active'
        }
    ];

    const webServerUsers: ModifiedUserAccountType[] = [
        {
            name: 'root',
            isAdmin: true,
            gid: '0',
            uid: '0',
            isLocal: true,
            shell: '/bin/bash',
            groups: ['root', 'sudo']
        },
        {
            name: 'www-data',
            isAdmin: false,
            gid: '33',
            uid: '33',
            isLocal: true,
            shell: '/usr/sbin/nologin',
            groups: ['www-data']
        }
    ];

    const webServer01Connections: ModifiedConnectionType[] = [
      {
          localAddress: "0.0.0.0:80",
          remoteAddress: "",
          state: "listen",
          protocol: "TCP",
          process: {
              name: "nginx",
              pid: 12345,
          }
      }
  ];

    // Linux Web Server Host
    await createHost({
        hostname: 'webserver01',
        ip: '192.168.60.10',
        os: 'Linux',
        version: 'Ubuntu 22.04 LTS',
        cores: 4,
        cpu: '12th Gen Intel(R) Core(TM) i5-12600K',
        memory: 16384,
        password: 'WebPass123!',
        status: 'UP',
        gateway: '192.168.60.1',
        dhcp: false,
        macAddress: '00:1A:2B:3C:4D:5E',
        disks: standardLinuxDisks,
        ports: webServerNetworkServices,
        services: webServerServices,
        users: webServerUsers,
        connections: webServer01Connections
    });

    // Windows Domain Controller
    const dcServices: Prisma.SystemServiceCreateManyHostInput[] = [
        {
            name: 'DNS',
            startMode: 'Enabled',
            state: 'loaded',
            status: 'active'
        },
        {
            name: 'NTDS',
            startMode: 'Enabled',
            state: 'loaded',
            status: 'active'
        }
    ];

    const dcNetworkServices: ModifiedNetworkServiceType[] = [
        {
            port: 53,
            protocol: "TCP",
            process: {
                pid: 4,
                name: "dns"
            },
            version: "10.0.17763.1",
            state: "listen"
        },
        {
            port: 389,
            protocol: "TCP",
            process: {
                pid: 628,
                name: "lsass"
            },
            version: "10.0.17763.1",
            state: "listen"
        }
    ];

    await createHost({
        hostname: 'dc01',
        ip: '192.168.60.11',
        os: 'windows',
        version: 'Windows Server 2022',
        cores: 4,
        cpu: '12th Gen Intel(R) Core(TM) i5-12600K',
        memory: 32768,
        password: 'DCPass123!',
        status: 'UP',
        gateway: '192.168.60.1',
        dhcp: false,
        macAddress: '00:2B:3C:4D:5E:6F',
        disks: standardWindowsDisks,
        ports: dcNetworkServices,
        services: dcServices,
        users: [
            {
                name: 'Administrator',
                isAdmin: true,
                gid: '500',
                uid: '500',
                isLocal: true,
                shell: 'powershell.exe',
                groups: ['Administrators', 'Domain Admins']
            }
        ]
    });

    // Linux Database Server
    const dbNetworkServices: ModifiedNetworkServiceType[] = [
        {
            port: 5432,
            protocol: "TCP",
            process: {
                pid: 1234,
                name: "postgres"
            },
            version: "14.2",
            state: "listen"
        }
    ];

    await createHost({
        hostname: 'dbserver01',
        ip: '192.168.60.12',
        os: 'Linux',
        version: 'Rocky Linux 8.5',
        cores: 8,
        cpu: '12th Gen Intel(R) Core(TM) i7-12700K',
        memory: 65536,
        password: 'DbPass123!',
        status: 'UP',
        gateway: '192.168.60.1',
        dhcp: false,
        macAddress: '00:3C:4D:5E:6F:7G',
        disks: standardLinuxDisks,
        ports: dbNetworkServices,
        services: [
            {
                name: 'postgresql-14',
                startMode: 'Enabled',
                state: 'loaded',
                status: 'active'
            }
        ],
        users: [
            {
                name: 'postgres',
                isAdmin: false,
                gid: '26',
                uid: '26',
                isLocal: true,
                shell: '/bin/bash',
                groups: ['postgres']
            }
        ]
    });

    // Windows File Server
    const fileServerShares: Prisma.ShareCreateManyHostInput[] = [
        {
            shareType: "sMB",
            networkPath: "\\\\fileserver01\\SharedDocs"
        },
        {
            shareType: "sMB",
            networkPath: "\\\\fileserver01\\UserHomes"
        }
    ];

    await createHost({
        hostname: 'fileserver01',
        ip: '192.168.60.13',
        os: 'windows',
        version: 'Windows Server 2022',
        cores: 4,
        cpu: '12th Gen Intel(R) Core(TM) i5-12600K',
        memory: 32768,
        password: 'FilePass123!',
        status: 'UP',
        gateway: '192.168.60.1',
        dhcp: false,
        macAddress: '00:4D:5E:6F:7G:8H',
        disks: standardWindowsDisks,
        ports: [
            {
                port: 445,
                protocol: "TCP",
                process: {
                    pid: 4,
                    name: "System"
                },
                version: "10.0.17763.1",
                state: "listen"
            }
        ],
        shares: fileServerShares,
        users: [
            {
                name: 'Administrator',
                isAdmin: true,
                gid: '500',
                uid: '500',
                isLocal: true,
                shell: 'powershell.exe',
                groups: ['Administrators']
            }
        ]
    });

    // Linux Container Host
    const containerHost: ExtendedContainerType[] = [
        {
            containerId: "abc123def456",
            name: "/webapp_1",
            status: "running",
            cmd: "npm start",
            containerNetworks: [
                {
                    networkName: "bridge",
                    ip: "172.17.0.2",
                    gateway: "172.17.0.1",
                    macAddress: "02:42:ac:11:00:02"
                }
            ],
            portBindings: ['3000:3000'],
            containerVolumes: [
                {
                    hostPath: "/var/lib/docker/volumes/webapp_data/_data",
                    containerPath: "/app/data",
                    mode: "rw",
                    volumeName: "webapp_data",
                    rw: true,
                    vType: "volume"
                }
            ]
        }
    ];

    await createHost({
        hostname: 'docker01',
        ip: '192.168.60.14',
        os: 'Linux',
        version: 'Ubuntu 22.04 LTS',
        cores: 8,
        cpu: '12th Gen Intel(R) Core(TM) i7-12700K',
        memory: 32768,
        password: 'DockerPass123!',
        status: 'UP',
        gateway: '192.168.60.1',
        dhcp: false,
        macAddress: '00:5E:6F:7G:8H:9I',
        disks: standardLinuxDisks,
        containers: containerHost,
        ports: [
            {
                port: 2375,
                protocol: "TCP",
                process: {
                    pid: 1234,
                    name: "dockerd"
                },
                version: "20.10.14",
                state: "listen"
            }
        ]
    });

    // Windows Development Workstation
    await createHost({
        hostname: 'devws01',
        ip: '192.168.60.15',
        os: 'windows',
        version: 'Windows 11 Pro',
        cores: 8,
        cpu: '12th Gen Intel(R) Core(TM) i7-12700K',
        memory: 32768,
        password: 'DevPass123!',
        status: 'UP',
        gateway: '192.168.60.1',
        dhcp: true,
        macAddress: '00:6F:7G:8H:9I:0J',
        disks: standardWindowsDisks,
        ports: [
            {
                port: 3389,
                protocol: "TCP",
                process: {
                    pid: 4,
                    name: "TermService"
                },
                version: "10.0.22000.1",
                state: "listen"
            }
        ],
        users: [
            {
                name: 'developer',
                isAdmin: true,
                gid: '1000',
                uid: '1000',
                isLocal: true,
                shell: 'powershell.exe',
                groups: ['Administrators', 'Docker-Users']
            }
        ]
    });

    // Linux Monitoring Server
    await createHost({
        hostname: 'monitor01',
        ip: '192.168.60.16',
        os: 'Linux',
        version: 'Ubuntu 22.04 LTS',
        cores: 4,
        cpu: '12th Gen Intel(R) Core(TM) i5-12600K',
        memory: 16384,
        password: 'MonitorPass123!',
        status: 'UP',
        gateway: '192.168.60.1',
        dhcp: false,
        macAddress: '00:7G:8H:9I:0J:1K',
        disks: standardLinuxDisks,
        ports: [
            {
                port: 9090,
                protocol: "TCP",
                process: {
                    pid: 1234,
                    name: "prometheus"
                },
                version: "2.36.2",
                state: "listen"
            }
        ],
        users: [
            {
                name: 'prometheus',
                isAdmin: false,
                gid: '998',
                uid: '998',
                isLocal: true,
                shell: '/bin/false',
                groups: ['prometheus']
            }
        ]
    });

    // Windows Security Server
    await createHost({
        hostname: 'security01',
        ip: '192.168.60.17',
        os: 'windows',
        version: 'Windows Server 2022',
        cores: 8,
        cpu: '12th Gen Intel(R) Core(TM) i7-12700K',
        memory: 32768,
        password: 'SecPass123!',
        status: 'UP',
        gateway: '192.168.60.1',
        dhcp: false,
        macAddress: '00:8H:9I:0J:1K:2L',
        disks: standardWindowsDisks,
        ports: [
            {
                port: 8834,
                protocol: "TCP",
                process: {
                    pid: 4567,
                    name: "nessus"
                },
                version: "8.15.1",
                state: "listen"
            }
        ],
        services: [
            {
                name: 'Tenable Nessus',
                startMode: 'Enabled',
                state: 'loaded',
                status: 'active'
            }
        ]
    });

    console.log('Seed completed successfully!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });