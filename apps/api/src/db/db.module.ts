import { Global, Module, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { db, testConnection } from './client';
import { DB_TOKEN } from './constants';

@Global()
@Module({
  providers: [
    {
      provide: DB_TOKEN,
      useValue: db,
    },
  ],
  exports: [DB_TOKEN],
})
export class DbModule implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(DbModule.name);

  async onApplicationBootstrap() {
    this.logger.log('Testing database connection...');
    await testConnection();
  }
}
