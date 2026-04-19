import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [DbModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
