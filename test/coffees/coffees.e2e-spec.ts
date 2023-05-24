import { Test, TestingModule } from '@nestjs/testing';
import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { TimeoutInterceptor } from '../../src/common/interceptors/timeout.interceptor';
import { WrapResponseInterceptor } from '../../src/common/interceptors/wrap-response.interceptor';
import * as request from 'supertest';


describe('[Feature] Coffees - /coffees', () => {
  jest.setTimeout(10000);

  let app: INestApplication;
  let httpServer: HttpServer;
  const coffee = {
    name: 'my super cofee',
    brand: 'muy suer pbrand',
    flavors: ['choco', 'mint']
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        })
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new WrapResponseInterceptor(), new TimeoutInterceptor());

    await app.init();
    httpServer = app.getHttpServer();

  });

  it('Create [POST /]', () => {
    return request(httpServer).post('/coffees').send(coffee).expect(HttpStatus.CREATED).then(({ body }) => {
      console.log({ body });
      const receivedCoffee = body.data;
      expect(receivedCoffee.name).toEqual(coffee.name);

    });
  });
  it('Get all [GET /]', () => {
    return request(httpServer).get('/coffees').then(({ body }) => {
      console.log({ body });
      const receivedCoffees = body.data;
      expect(receivedCoffees[0].name).toEqual(coffee.name);
    });
  });
  // WEIRD: ça marche pas mais si j'enlève le test de CREATE ça marche .... 
  it.todo('Get one [GET /:id]');
  it.todo('Update one [PATCH /:id]');
  it.todo('Delete one [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  })
});
