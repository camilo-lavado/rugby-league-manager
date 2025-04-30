import { Controller, Get } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';

@ApiTags('Tests')
@Controller('test')
export class TestController {
  @Get('throttle')
  @Throttle({
    default: {
      limit: 5,
      ttl: 10000,
    },
  })
  @ApiOperation({ summary: 'Endpoint con límite de peticiones' })
  @ApiResponse({ status: 200, description: 'Mensaje de prueba con throttle' })
  @ApiResponse({ status: 429, description: 'Demasiadas peticiones' })
  @ApiHeader({
    name: 'X-RateLimit-Limit',
    description: 'Número máximo de peticiones permitidas',
  })
  @ApiHeader({
    name: 'X-RateLimit-Remaining',
    description: 'Número de peticiones restantes en el periodo actual',
  })
  getThrottleData() {
    return 'Ruta de prueba de Throttle!';
  }

  @Get('unlimited')
  @SkipThrottle()
  @ApiOperation({ summary: 'Endpoint sin límite de peticiones' })
  @ApiResponse({ status: 200, description: 'Mensaje de prueba sin throttle' })
  getLimitedData() {
    return 'Ruta de prueba sin Throttle!';
  }
}