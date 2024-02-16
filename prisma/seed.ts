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
          "email":"jasper@csusb.edu",
          "password":"$2b$12$d.JhcGZhCPrK/SzIl7olHOlG8umwcZbM.2ptkKn38uzCkzmc41uW.",
          "name":"Jasper",
        },
        {
          "email":"noah@csusb.edu",
          "password":"$2b$12$GRaAwxgFWG4KAsx1lPiWVemw/Ve1VAYIKID8F63ZH5g7g2WOgmODa",
          "name":"Noah",
        },
      ];
    
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

