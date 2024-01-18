import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const apiKey = process.env.API_KEY || '';
    const lifetime = parseInt(process.env.API_KEY_LIFETIME || '0');

    await prisma.apiKey.create({
        data: {
            key: apiKey,
            type: 'HOST',
            ...(isNaN(lifetime) ? {} : { lifetime }) // Include lifetime only if it's a valid number
        },
    });

    await prisma.apiKey.create({
        data: {
            key: '440e585a2a08a4e5b2bef11d3469e6538491cfaec0d3f9a139d8db022e59a03bfd6095f25f876eae7a8689574c2e2687fb4b5c892e238f677b9af81785404703',
            type: 'FIREWALL',
            lifetime: 10,
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

