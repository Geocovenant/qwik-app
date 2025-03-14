import { QwikAuth$ } from "@auth/qwik";
import GitHub from "@auth/qwik/providers/github";
import Google from "@auth/qwik/providers/google";
import PostgresAdapter from "@auth/pg-adapter"
import pkg from 'pg';

// Aseguramos que este código solo se ejecute en el servidor
export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(
  () => {
    const { Pool } = pkg;
    const pool = new Pool({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    return {
      providers: [GitHub, Google],
      adapter: PostgresAdapter(pool),
      callbacks: {
        session({ session }) {
          return session;
        },
      },
    };
  }
);