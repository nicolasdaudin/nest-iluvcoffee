import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const toInteger = parseInt(value, 10);
    if (isNaN(toInteger)) throw new BadRequestException(`Bad Request: ${value} should be an integer`);
    return toInteger;
  }
}
