import { PrismaClient } from '@prisma/client';
import { generateApiKey } from  'generate-api-key';
import { addHoursToCurrentTime } from '../src/lib/apikeyHelper';
import { hash } from 'bcrypt';



const prisma = new PrismaClient();

async function main() {
    const apiKey = process.env.API_KEY || '';
    const lifetime = parseInt(process.env.API_KEY_LIFETIME || '0');

    const users = [
        {
          "email":"hunter@csusb.edu",
          "password":"$2b$12$eOiAxyCmxsfHstz43CQRou2Wxww9XOVgmH0Z35v/3pZrc7uYiU3pW",
          "name":"Hunter",
        },
        {
          "email":"jaylon@csusb.edu",
          "password":"$2b$12$tukI444NtRCEY4PL1tdlqehO2IVOaNo.SWGNHKdpgf8WdIupqiN7e",
          "name":"Jaylon",
        },
        {
          "email":"christian@csusb.edu",
          "password":"$2b$12$csBttbAzeO8ibWFUzsW0VOgKIUXL2e.mEQP4tXlcV0ZAIDtSZTDIe",
          "name":"Chrisitan",
        },
        {
          "email":"alberto@csusb.edu",
          "password":"$2b$12$9DEENHG7PVgIcLFas9qGguxifwOdsG8V9ZmPWmc/w3nooTUSDpTqu",
          "name":"Alberto",
        },
        {
          "email":"brett@csusb.edu",
          "password":"$2b$12$A/4IzfKbhPk8cXrkCV7Ru.B0dq4MdtDtKnVBNzmge77MRUnqvL64K",
          "name":"Brett",
        },
        {
          "email":"friday@csusb.edu",
          "password":"$2b$12$93W09RDNHESV3MlFMJxzPunUeE0viKTMqbwZCaXGyVuY/.JDYIilq",
          "name":"Friday",
        },
        {
          "email":"jason@csusb.edu",
          "password":"$2b$12$M55oeOelF4F4fbB/7bS6A.qAD9E4RZhNzqJcA5hwAzmSYe94O6ZLK",
          "name":"Jason",
        },
        {
          "email":"maddie@csusb.edu",
          "password":"$2b$12$LheTPe/pynHutfBIZuhBhOaCZzUd3SkmIslb0Fcwxwp0REtXIEzTm",
          "name":"Maddie",
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
        hostname: 'bingus',
        ip: '192.168.60.222',
        os: 'Linux',
        version: 'Ubuntu 20.04',
        cores: 4,
        cpu: '13th Gen Intel(R) Core(TM) i9-13900HX',
        password: 'password123',
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
    });

    const host2 = await createHost({
        hostname: 'bathtub',
        ip: '192.168.60.167',
        os: 'windows',
        version: 'Windows 10 Pro',
        password: 'password123',
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
    // await prisma.apiKey.create({
    //     data: {
    //         key: process.env.API_KEY,
    //         type: 'HOST',
    //         lifetime: 10,
    //     },
    // });

    const host3 = await createHost({
        hostname: 'aaron',
        ip: '192.168.60.251',
        os: 'windows',
        version: 'Windows 10 Pro',
        password: 'Password123!',
        cores: 8,
        memory: 931712,
        cpu: '13th Gen Intel(R) Core(TM) i9-13900HX',
        disks: host2Disks,
        status: 'UP',
        gateway: '192.168.60.1',
        dhcp: true,
        macAddress: '56:78:9A:BC:DE:F0',
    });

    await prisma.apiKey.create({
        data: {
            key: apiKey,
            type: 'HOST',
            lifetime: lifetime,
        },
    });

    await prisma.apiKey.create({
        data: {
            key: generateApiKey({ method: 'string', length: 32}) as string,
            type: 'FIREWALL',
            lifetime: addHoursToCurrentTime(8),
        },
    });

    console.log('API Table created!');

}

main()
    .catch(e => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

