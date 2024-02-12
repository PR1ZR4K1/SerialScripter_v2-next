 #!/bin/bash

sudo docker compose down
sleep 2

sudo docker compose -f ./docker-compose-testing.yml up -d
sleep 2

npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

npm run dev