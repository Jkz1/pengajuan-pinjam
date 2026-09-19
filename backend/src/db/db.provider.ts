import { Provider } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

export const DB_CONNECTION = 'DB_CONNECTION';
export const DB_POOL = 'DB_POOL';

export const dbPoolProvider: Provider = {
  provide: DB_POOL,
  useFactory: () => {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  },
};

export const dbProvider: Provider = {
  provide: DB_CONNECTION,
  inject: [DB_POOL],
  useFactory: (pool: Pool) => {
    return drizzle(pool, { schema });
  },
};
