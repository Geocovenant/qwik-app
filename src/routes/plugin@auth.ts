import { QwikAuth$ } from "@auth/qwik";
import GitHub from "@auth/qwik/providers/github";
import PostgresAdapter from "@auth/pg-adapter"
import pkg from 'pg';
const {Pool} = pkg;

const pool = new Pool({
  host: 'localhost',
  user: 'seba',
  password: '123456',
  database: 'geounity_db',
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