import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const apiKey = process.env.API_KEY || '';
    const lifetime = parseInt(process.env.API_KEY_LIFETIME || '0');

    const users = [
        {
          "email":"hunter@csusb.edu",
          "password":"hunteriscool604!",
          "name":"Hunter",
        },
        {
          "email":"jaylon@csusb.edu",
          "password":"jayloniscool604!",
          "name":"Jaylon",
        },
        {
          "email":"christian@csusb.edu",
          "password":"christianiscool604!",
          "name":"Chrisitan",
        },
        {
          "email":"alberto@csusb.edu",
          "password":"albertoiscool604!",
          "name":"Alberto",
        },
        {
          "email":"brett@csusb.edu",
          "password":"brettiscool604!",
          "name":"Brett",
        },
        {
          "email":"friday@csusb.edu",
          "password":"fridayiscool604!",
          "name":"Friday",
        },
        {
          "email":"jason@csusb.edu",
          "password":"jasoniscool604!",
          "name":"Jason",
        },
        {
          "email":"maddie@csusb.edu",
          "password":"maddieiscool604!",
          "name":"Maddie",
        },
        {
          "email":"jasper@csusb.edu",
          "password":"jasperiscool604!",
          "name":"Jasper",
        },
        {
          "email":"noah@csusb.edu",
          "password":"noahiscool604!",
          "name":"Noah",
        },
      ]
    
      users.forEach(async (user) => {
        await prisma.user.create({
            data: {
                email: user.email,
                password: user.password,
                name: user.name,
            },
        });
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

