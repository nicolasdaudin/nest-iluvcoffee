import { ArgumentMetadata, BadRequestException, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto/create-coffee.dto';

@Injectable()
export class CreateCoffeePipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    // console.log('CreateCoffeePipe');
    if (!value || Object.keys(value).length < 1) { throw new BadRequestException('Nothing provided in the body') }

    const object = plainToInstance<CreateCoffeeDto, CreateCoffeeDto>(metadata.metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const formattedErrors = errors.map(error => {
        for (const key in error.constraints) {
          if (key === 'isString') {
            return `${error.property} doit être une chaîne de caractère`
          }
          if (key === 'isNotEmpty') {
            return `${error.property} ne doit pas être vide`
          }
          return error.constraints[key];
        }

      })
      throw new BadRequestException(`Validation failed: ${formattedErrors}`);
    }


    return value;
  }
}
