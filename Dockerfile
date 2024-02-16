# Build stage
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Install build dependencies (Alpine uses apk)
# Note: build dependencies can be removed after building
RUN apk --no-cache add --virtual builds-deps build-base 

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy ansible playbooks from the host to builder
COPY playbooks ./playbooks

COPY nginx ./nginx

COPY certificates ./certificates

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

RUN apk --no-cache add ansible sshpass openssh nginx

RUN ansible-galaxy collection install community.docker --force

# Create a directory for Nginx pid and temp files
RUN mkdir -p /run/nginx
RUN mkdir -p /etc/ssl/certs && mkdir -p /etc/ssl/private
# Set permissions for the private directory
RUN chmod 700 /etc/ssl/private



RUN mkdir /opt/memento

# Copy built node modules and build directories from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/.env ./
COPY --from=builder /app/.env.local ./
COPY --from=builder /app/playbooks ./playbooks
COPY --from=builder /app/gotty ./
COPY --from=builder /app/ansible.cfg ./
COPY --from=builder /app/nginx/nginx.conf /etc/nginx/
COPY --from=builder /app/certificates/cert.pem /etc/ssl/certs/
COPY --from=builder /app/certificates/key.pem /etc/ssl/private/

# Ensure the private key is secure
RUN chmod 600 /etc/ssl/private/key.pem

# Set environment to production
ENV NODE_ENV=production

# Expose port 3000
EXPOSE 3000 3001

# Start the application
# CMD ["/bin/sh", "-c", "while ! nc -z 127.0.0.1 5432; do sleep 1; done; npx prisma db push && npx prisma db seed && npm start"]

CMD ["/bin/sh", "-c", "nginx && sleep 5; npx prisma db push && npx prisma db seed && npm start"]
