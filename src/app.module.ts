import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import * as process from 'process';


@Module({})
export class AppModule {
  static register(db_uri?: string): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
          isGlobal: true
        }),
        MongooseModule.forRoot(db_uri || process.env.DB_URI),
        BookModule,
        AuthModule
      ],
      controllers: [AppController],
      providers: [AppService]
    };
  }
}
