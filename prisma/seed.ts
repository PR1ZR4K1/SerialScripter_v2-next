import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const dummyHosts = [
        {
            hostname: 'bathtub',
            ip: '192.168.60.167',
            os: 'Windows',
            cpu_cores: 4,
            memory: 16,
            disk: 256,
            status: 'UP',
        },
        {
            hostname: 'example2.com',
            ip: '192.168.0.2',
            os: 'Linux',
            cpu_cores: 2,
            memory: 8,
            disk: 128,
            status: 'DOWN',
        },
        {
            hostname: 'example3.com',
            ip: '192.168.0.3',
            os: 'Router',
            cpu_cores: 6,
            memory: 32,
            disk: 512,
            status: 'UP',
        },
        {
            hostname: 'example4.com',
            ip: '192.168.0.4',
            os: 'Windows',
            cpu_cores: 8,
            memory: 32,
            disk: 512,
            status: 'UP',
        },
        {
            hostname: 'example5.com',
            ip: '192.168.0.5',
            os: 'Linux',
            cpu_cores: 4,
            memory: 16,
            disk: 256,
            status: 'DOWN',
        },
        {
            hostname: 'example6.com',
            ip: '192.168.0.6',
            os: 'Router',
            cpu_cores: 2,
            memory: 8,
            disk: 128,
            status: 'UP',
        },
        {
            hostname: 'example7.com',
            ip: '192.168.0.7',
            os: 'Windows',
            cpu_cores: 6,
            memory: 32,
            disk: 512,
            status: 'UP',
        },
        {
            hostname: 'example8.com',
            ip: '192.168.0.8',
            os: 'Linux',
            cpu_cores: 2,
            memory: 8,
            disk: 128,
            status: 'DOWN',
        },
        {
            hostname: 'example9.com',
            ip: '192.168.0.9',
            os: 'Router',
            cpu_cores: 4,
            memory: 16,
            disk: 256,
            status: 'UP',
        },
        {
            hostname: 'example10.com',
            ip: '192.168.0.10',
            os: 'Windows',
            cpu_cores: 4,
            memory: 16,
            disk: 256,
            status: 'UP',
        },
        {
            hostname: 'example11.com',
            ip: '192.168.0.11',
            os: 'Linux',
            cpu_cores: 2,
            memory: 8,
            disk: 128,
            status: 'DOWN',
        },
        {
            hostname: 'example12.com',
            ip: '192.168.0.12',
            os: 'Router',
            cpu_cores: 6,
            memory: 32,
            disk: 512,
            status: 'UP',
        },
        {
            hostname: 'example13.com',
            ip: '192.168.0.13',
            os: 'Windows',
            cpu_cores: 8,
            memory: 32,
            disk: 512,
            status: 'UP',
        },
        {
            hostname: 'example14.com',
            ip: '192.168.0.14',
            os: 'Linux',
            cpu_cores: 4,
            memory: 16,
            disk: 256,
            status: 'DOWN',
        },
        {
            hostname: 'example15.com',
            ip: '192.168.0.15',
            os: 'Router',
            cpu_cores: 2,
            memory: 8,
            disk: 128,
            status: 'UP',
        },
    ];


    for (const hostData of dummyHosts) {
        await prisma.host.create({
            data: {
                ...hostData,
                createdAt: new Date(),
            },
        });
    }

    const password = await hash('test', 12)

    const user = await prisma.user.upsert({
        where: { email: 'test@test.com' },
        update: {},
        create: {
            email: 'test@test.com',
            name: 'Test User',
            password: password,
        }
    })
    console.log({ user })
}
main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
