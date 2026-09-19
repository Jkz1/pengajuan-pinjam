import { Global, Module, OnModuleDestroy, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { dbPoolProvider, dbProvider, DB_POOL } from './db.provider.js';

@Global()
@Module({
  providers: [dbPoolProvider, dbProvider],
  exports: [dbProvider],
})
export class DbModule implements OnModuleDestroy {
  constructor(@Inject(DB_POOL) private readonly pool: Pool) {}

  async onModuleDestroy() {
    await this.pool.end();
  }
}
