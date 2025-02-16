import { QwikAuth$ } from "@auth/qwik";
import GitHub from "@auth/qwik/providers/github";

export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(
  () => ({
    providers: [GitHub],
    callbacks: {
      jwt: async ({ token }) => {
        return token
      },
      session: async ({ session, token }) => {
        console.log('session: ', session)
        console.log('token: ', token)
        return session
      }
    },
    
  })
);
