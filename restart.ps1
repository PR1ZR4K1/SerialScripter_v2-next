# Stop and remove Docker Compose containers
docker-compose down

# Wait for 2 seconds
Start-Sleep -Seconds 2

# Start Docker Compose containers in the background
docker-compose -f .\docker-compose-testing.yml up -d

# Wait for 2 seconds
Start-Sleep -Seconds 2

# Generate Prisma client
npx prisma generate

# Run Prisma migration for development with the name 'init'
npx prisma migrate dev

# Seed the database with data
npx prisma db seed
