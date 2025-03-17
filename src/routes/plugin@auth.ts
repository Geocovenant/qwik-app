import { QwikAuth$ } from "@auth/qwik";
import GitHub from "@auth/qwik/providers/github";
import Google from "@auth/qwik/providers/google";

export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(
  (params) => {
    return {
      providers: [
        GitHub({
          clientId: params.env.get("AUTH_GITHUB_ID"),
          clientSecret: params.env.get("AUTH_GITHUB_SECRET"),
          checks: ["none"],
        }),
        Google({
          clientId: params.env.get("AUTH_GOOGLE_ID"),
          clientSecret: params.env.get("AUTH_GOOGLE_SECRET"),
          checks: ["none"],
        }),
      ]
    };
  }
);