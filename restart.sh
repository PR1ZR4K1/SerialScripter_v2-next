 #!/bin/sh

sudo docker compose down
sleep 2

sudo docker compose up -d
sleep 2

npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
