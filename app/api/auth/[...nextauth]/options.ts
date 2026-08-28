import GithubProvider from 'next-auth/providers/github'
import { JWT } from 'next-auth/jwt'
import { Session } from 'next-auth'
import { Account } from 'next-auth'

// Extend Session type to include accessToken
interface CustomSession extends Session {
  accessToken?: string
}

// Extend JWT type to include accessToken
interface CustomJWT extends JWT {
  accessToken?: string
}

const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
      // GitHub sends an `iss` param in OAuth callbacks since its RFC 9207
      // rollout (April 2026); next-auth <=4.24.12 has no default issuer, so
      // sign-in fails with "issuer must be configured on the issuer" without this.
      issuer: 'https://github.com/login/oauth',
      authorization: {
        params: {
          scope: 'read:user user:email repo',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: CustomJWT; account: Account | null }) {
      // Add access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }: { session: CustomSession; token: CustomJWT }) {
      // Add access_token to the session
      session.accessToken = token.accessToken
      return session
    },
  },
}

export default authOptions
