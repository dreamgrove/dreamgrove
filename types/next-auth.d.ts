import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
  }
}
