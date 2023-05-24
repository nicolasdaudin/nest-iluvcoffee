import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {

    console.log('Hi from logging middleware, only for GET coffees routes')
    console.time('request-response')
    res.on('finish', () => { console.timeEnd('request-response') })
    next();
  }
}
