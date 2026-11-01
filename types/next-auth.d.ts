// The GitHub OAuth token rides in the encrypted JWT cookie (see app/api/auth/[...nextauth]/options.ts).
// The import makes this a module augmentation rather than a replacement of next-auth/jwt.
import 'next-auth/jwt'

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
  }
}
