// Setup basic Nextauth authoptions and such
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { authOptions } from './AuthOptions'



const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

