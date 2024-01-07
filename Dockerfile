# Build stage
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Install build dependencies (Alpine uses apk)
# Note: build dependencies can be removed after building
RUN apk --no-cache add --virtual builds-deps build-base python3

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies, including Prisma
RUN npm install

# Copy the Prisma schema and other necessary files
COPY prisma ./prisma

# Run Prisma generate to generate Prisma client
RUN npx prisma generate

# Copy the rest of the code
COPY . .

# Build the application
RUN npm run build

# Remove build dependencies
RUN apk del builds-deps

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy built node modules and build directories from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./
COPY --from=builder /app/.env.local ./

# Set environment to production
ENV NODE_ENV=production

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["/bin/sh", "-c", "while ! nc -z postgres 5432; do sleep 1; done; npx prisma db push && npx prisma db seed && npm start"]
