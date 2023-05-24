import { Injectable, Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import {
  COFFEE_BRANDS_ASYNC_FACTORY,
  COFFEE_BRANDS_BASIC_FACTORY,
  COFFEE_BRANDS_FACTORY_CLASS,
  COFFEE_BRANDS_NON_CLASS_BASED,
} from './coffees.constants';
import { DatabaseModule } from '../database/database.module';
import { Connection } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import coffeesConfig from './coffees.config';

@Injectable()
export class CoffeeBrandsServiceClass {
  getAll(): string[] {
    return [''];
  }
}

@Injectable()
class DevelopmentCoffeeBrandsServiceClass extends CoffeeBrandsServiceClass {
  getAll(): string[] {
    return ['Development', 'nescafe', 'bonka'];
  }
}

@Injectable()
class ProductionCoffeeBrandsServiceClass extends CoffeeBrandsServiceClass {
  getAll(): string[] {
    return ['Production', 'nescafe', 'bonka'];
  }
}

@Injectable()
export class CoffeeBrandsFactoryClass {
  create() {
    return ['juan valdes', 'starbucks'];
  }
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    DatabaseModule.register({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', // username
      password: 'pass123',
      // user password
    }),
    ConfigModule.forFeature(coffeesConfig),
  ],

  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    CoffeeBrandsServiceClass,
    DevelopmentCoffeeBrandsServiceClass,
    ProductionCoffeeBrandsServiceClass,
    CoffeeBrandsFactoryClass,

    // Non-class-based Provider Tokens
    {
      provide: COFFEE_BRANDS_NON_CLASS_BASED,
      useValue: ['nespresso', 'bonka', 'nescafe'],
    },

    // Class Providers - do not work
    {
      provide: 'CoffeeBrandsServiceClass',

      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentCoffeeBrandsServiceClass
          : ProductionCoffeeBrandsServiceClass, // so far, always uses this one ... so probably, doesn't read the process.env variable. Maybe not injected...
    },

    // Basic Factory Provider
    {
      provide: COFFEE_BRANDS_BASIC_FACTORY,
      useFactory: () => ['marcilla', 'cafe lor'],
    },

    // Class Factory
    {
      provide: COFFEE_BRANDS_FACTORY_CLASS,
      inject: [CoffeeBrandsFactoryClass],
      useFactory: (factory: CoffeeBrandsFactoryClass) => {
        return factory.create();
      },
    },

    // // Async Factory
    // {
    //   provide: COFFEE_BRANDS_ASYNC_FACTORY,
    //   // could be a database connection, API call, any waiting stuff
    //   useFactory: async (connection: Connection): Promise<string[]> => {
    //     // const coffeeBrands = await connection.query('....');
    //     const coffeeBrands = await Promise.resolve(['alcampo', 'auchan']);
    //     console.log('inside async factory');
    //     return coffeeBrands;
    //   },
    // },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule { }
