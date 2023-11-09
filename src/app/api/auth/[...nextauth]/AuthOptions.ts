// Setup basic Nextauth authoptions and such
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcrypt'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            name: 'Sign in',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'admin@example.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })

                if (!user) {
                    return null
                }

                const isValid = await compare(credentials.password, user.password)

                if (!isValid) {
                    return null
                }

                return {
                    id: user.id+ '',
                    name: user.name,
                    email: user.email,
                }
            }
        })
    ],
    callbacks: {
        session: ({session, token}) => {
            console.log('Session Callback', {session, token})
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                }
            }
        },
        jwt: ({ token, user }) => {
            console.log('jwt callback', { token, user })
            if (user) {
                const u = user as unknown as any
                return {
                    ...token,
                    id: user.id,
                }
            }
            return token
        }
    }
}