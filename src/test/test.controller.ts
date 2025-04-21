import { Controller, Get } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('test')
export class TestController {
  @Get('throttle')
  @Throttle({
    default: {
      limit: 5,
      ttl: 10000,
    },
  }) 
  getThrottleData() {
    return 'Ruta de prueba de Throttle!';
  }

  @Get('limited')
  @SkipThrottle()
  getLimitedData() {
    return 'Ruta de prueba sin Throttle!';
  }
}

