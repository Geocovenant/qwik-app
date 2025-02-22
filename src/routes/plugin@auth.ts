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
      host: 'localhost',
      user: 'seba',
      password: '123456',
      database: 'geounity_db',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    return {
      providers: [GitHub, Google],
      adapter: PostgresAdapter(pool),
    };
  }
);