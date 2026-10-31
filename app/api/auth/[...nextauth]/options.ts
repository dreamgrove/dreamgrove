import GithubProvider from 'next-auth/providers/github'
import { JWT } from 'next-auth/jwt'
import { Account } from 'next-auth'

// The GitHub token lives only in the encrypted JWT cookie and is read on the server
// with getToken (lib/admin/access.ts). Never copy it onto the session: /api/auth/session
// hands the session to client JavaScript.
interface CustomJWT extends JWT {
  accessToken?: string
}

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
  console.error(
    '[next-auth] GITHUB_ID / GITHUB_SECRET are not set; GitHub sign-in will fail. See .env.local.example.'
  )
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
          // public_repo is enough to fork dreamgrove, push to the fork and open PRs
          scope: 'read:user user:email public_repo',
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
  },
}

export default authOptions
