import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller('test')
export class TestController {
 @Get('throttle')
   @Throttle({
    default: {
      limit: 5,
      ttl: 10000,
    },
  }) 
  @Get('limited')
  getLimitedData() {
    return 'Ruta de prueba de Throttle!';
  }
}
