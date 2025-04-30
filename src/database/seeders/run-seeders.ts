// src/database/seeders/run-seeders.ts
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  const logger = new Logger('Seeder');
  
  try {
    const appContext = await NestFactory.createApplicationContext(SeederModule);
    const seederService = appContext.get(SeederService);
    
    logger.log('Iniciando proceso de seeding de la base de datos...');
    await seederService.seed();
    logger.log('¡Seeding completado exitosamente!');
    
    await appContext.close();
    process.exit(0);
  } catch (error) {
    logger.error('Error durante el proceso de seeding');
    logger.error(error);
    process.exit(1);
  }
}

bootstrap();