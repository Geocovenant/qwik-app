import { QwikAuth$ } from "@auth/qwik";
import GitHub from "@auth/qwik/providers/github";
import PostgresAdapter from "@auth/pg-adapter"
import pkg from 'pg';
const {Pool} = pkg;

const pool = new Pool({
  host: import.meta.env.DATABASE_HOST,
  user: import.meta.env.DATABASE_USER,
  password: import.meta.env.DATABASE_PASSWORD,
  database: import.meta.env.DATABASE_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(
  () => ({
    providers: [GitHub],
    adapter: PostgresAdapter(pool),
  })
);