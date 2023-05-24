import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly brand: string;

  @IsString({ each: true })
  readonly flavors: string[];
}
