import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.NEXT_PUBLIC_APP_BASEURL,
    fetchOptions: {credentials: 'include'},
})

export const { signIn, signUp, useSession } = authClient;