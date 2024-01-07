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

    console.log('API Table created!');

}

main()
    .catch(e => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

