import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Public } from '../common/decorators/public.decorators';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { Protocol } from '../common/decorators/protocol.decorators';
import { CreateCoffeePipe } from '../common/pipes/create-coffee.pipe';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) { }

  @Public()
  @Get()
  async findAll(@Protocol('https') protocol, @Query() paginationQueryDto: PaginationQueryDto) {
    // const { limit, offset } = paginationQuery;
    // return `This action returns all coffees : limit ${limit} and offset ${offset}`;
    return await this.coffeesService.findAll(paginationQueryDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // return `This action returns coffee #${id}`;
    console.log(id);
    return await this.coffeesService.findOne('' + id);
  }

  @Post()
  @UsePipes(CreateCoffeePipe)
  async create(@Body() createCoffeeDto: CreateCoffeeDto) {
    // return body;
    // console.log(createCoffeeDto instanceof CreateCoffeeDto);
    await this.coffeesService.create(createCoffeeDto);
    return createCoffeeDto;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return await this.coffeesService.update(id, updateCoffeeDto);
    // return `This action updates coffee #${id}`;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // return `This action deletes coffeee #${id}`;
    return await this.coffeesService.remove(id);
  }
}
