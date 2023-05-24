import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Event } from '../events/entities/event.entity'

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly dataSource: DataSource,
    // @Inject(COFFEE_BRANDS_NON_CLASS_BASED) coffeeBrandsNonClassBased: string[],
    // @Inject('CoffeeBrandsServiceClass')
    // coffeeBrandsServiceClass: CoffeeBrandsServiceClass,
    // @Inject(COFFEE_BRANDS_BASIC_FACTORY) coffeeBrandsBasicFactory: string[],
    // @Inject(COFFEE_BRANDS_FACTORY_CLASS) coffeeBrandsFactoryClass: string[],
    // @Inject(COFFEE_BRANDS_ASYNC_FACTORY) coffeeBrandsAsyncFactory: string[],
    // private readonly configService: ConfigService,
    // @Inject(coffeesConfig.KEY)
    // private coffeesConfiguration: ConfigType<typeof coffeesConfig>,
  ) {
    // console.log('non-based', coffeeBrandsNonClassBased);
    // console.log('env:', process.env.NODE_ENV);
    // console.log(
    //   'class-based (not working yet)',
    //   coffeeBrandsServiceClass.getAll(),
    // );
    // console.log('basic factory', coffeeBrandsBasicFactory);
    // console.log('factory class', coffeeBrandsFactoryClass);
    // console.log('async factory', coffeeBrandsAsyncFactory);

    // loading from direct .env files
    // const host = configService.get<string>('DATABASE_HOST', 'default_host');
    // console.log('database host', host);

    // loading from app.config file
    // const host = configService.get<string>('database.host', 'default_host');
    // console.log('database.host', host);

    // // loading from partial registration of coffees namespaced configuration
    // const coffeesConfigPartial = this.configService.get('coffees');
    // console.log(coffeesConfigPartial);
    // const databaseHost = this.configService.get('coffees.databaseHost');
    // console.log(databaseHost);

    // loading directly from type
    // console.log('typed', coffeesConfiguration.databaseHost);
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    // await new Promise(resolve => setTimeout(resolve, 1000));
    return this.coffeeRepository.find({
      relations: { flavors: true },
      skip: paginationQueryDto.offset,
      take: paginationQueryDto.limit,
    });
  }

  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id: +id },
      relations: { flavors: true },
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee ${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((flavor) => this.preloadFlavorByName(flavor)),
    );
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((flavor) =>
          this.preloadFlavorByName(flavor),
        ),
      ));

    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee ${id} not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: string) {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({
      where: { name: name },
    });
    if (existingFlavor) return existingFlavor;
    return this.flavorRepository.create({ name: name });
  }

  async recommend(coffee: Coffee) {
    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();
    try {
      coffee.recommendations++;

      const event = this.eventRepository.preload({
        name: 'recommend_coffee',
        type: 'coffee',
        payload: { coffeeId: coffee.id },
      });
      // const event = new Event();
      // event.name = 'recommend_coffee';
      // event.type = 'coffee';
      // event.payload = { coffeeId: coffee.id };

      queryRunner.manager.save(coffee);
      queryRunner.manager.save(event);

      queryRunner.commitTransaction();
    } catch (error) {
      queryRunner.rollbackTransaction();
    } finally {
      queryRunner.release();
    }
  }
}
