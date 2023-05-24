import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class Logging2Middleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    console.log('Hi from Logging Middleware 2!!! for all COFFEES routes');
    // console.log('Middleware 2 - now im gonna await a wee bit');
    // await new Promise(resolve => { setTimeout(resolve, 1000) });
    // console.log('Middleware 2 - ... and im done');
    next();
  }
}
