import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validaciones globales
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Rugby League Manager API')
    .setDescription('Documentación de la API para gestión de ligas de rugby')
    .setVersion('1.0')
    .addTag('leagues')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
});
