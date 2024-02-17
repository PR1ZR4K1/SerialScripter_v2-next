/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
        serverActions: { 
            allowedOrigins: ["http://localhost:8967", "https://localhost:8968", "http://localhost:8968", "http://localhost"],
        }
    },
}

module.exports = nextConfig

