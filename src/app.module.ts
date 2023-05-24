import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import appConfig from './config/app.config';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { CommonModule } from './common/common.module';
@Module({
  imports: [
    // validate env variables at startup with Joi - and throw runtime error if something is missing for ex
    // ConfigModule.forRoot({
    //   validationSchema: Joi.object({
    //     DATABASE_HOST: Joi.required(),
    //     DATABASE_PORT: Joi.number().default(5432),
    //     DATABASE_USERNAME: Joi.required(),
    //     DATABASE_PASSWORD: Joi.required(),
    //     DATABASE_NAME: Joi.required(),
    //   }),
    // }),

    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres', // type of our database
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USERNAME, // username
        password: process.env.DATABASE_PASSWORD, // name of our database,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true, // models will be loaded automatically
        synchronize: true, // your entities will be synced with the database(recommended: disable in prod)
      }),
    }),
    // config from config object
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    CoffeesModule,

    CoffeeRatingModule,
    DatabaseModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
