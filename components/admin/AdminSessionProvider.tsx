'use client'

// next-auth's SessionProvider isn't marked as a client component, so the
// (server) admin layout renders it through this boundary.
export { SessionProvider as default } from 'next-auth/react'
