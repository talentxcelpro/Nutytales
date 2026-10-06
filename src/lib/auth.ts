/**
 * NextAuth configuration for NuttyTales.com.
 *
 * Strategy  : JWT (stateless sessions)
 * Providers : Credentials (email + bcrypt password)
 * Roles     : Role enum from Prisma
 */

import NextAuth, { type DefaultSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validations'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      isB2BApproved: boolean
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role: string
    isB2BApproved: boolean
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const user = await prisma.user.findUnique({
          where: { email },
          include: { businessAccount: true },
        })

        if (!user || !user.passwordHash || !user.isActive) return null

        const passwordMatch = await bcrypt.compare(password, user.passwordHash)
        if (!passwordMatch) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: String(user.role),
          isB2BApproved: Boolean(user.businessAccount?.isApproved),
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: string }).role
        token.isB2BApproved = (user as { isB2BApproved: boolean }).isB2BApproved
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = String(token.id)
        session.user.role = String(token.role)
        session.user.isB2BApproved = Boolean(token.isB2BApproved)
      }
      return session
    },
  },
})
