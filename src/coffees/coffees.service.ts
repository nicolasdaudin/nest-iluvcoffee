import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Shipwreck Roast',
      brand: 'Buddy Brew',
      flavors: ['chocolate', 'vanilla'],
    },
  ];

  findAll() {
    return this.coffees;
  }

  // added by Nico
  findIndex(id: string) {
    const index = this.coffees.findIndex((coffee) => coffee.id === +id);
    if (index < 0) {
      throw new NotFoundException(`Coffee ${id} not found`);
    }
    return index;
  }

  findOne(id: string) {
    const coffee = this.coffees.find((coffee) => coffee.id === +id);
    if (!coffee) {
      throw new NotFoundException(`Coffee ${id} not found`);
    }
    return coffee;
  }

  create(coffeeObject: any) {
    this.coffees.push(coffeeObject);
  }

  update(id: string, coffeeObject: any) {
    // const coffeeIndex = this.coffees.findIndex((coffee) => coffee.id === +id);

    // this.coffees[coffeeIndex] = {
    //   ...this.coffees[coffeeIndex],
    //   ...coffeeObject,
    // };

    const index = this.findIndex(id);

    this.coffees[index] = {
      ...this.coffees[index],
      ...coffeeObject,
    };
  }

  remove(id: string) {
    // this.coffees = this.coffees.filter((coffee) => coffee.id !== +id);
    const coffeeIndex = this.coffees.findIndex((item) => item.id === +id);
    if (coffeeIndex >= 0) {
      this.coffees.splice(coffeeIndex, 1);
    }
  }
}
