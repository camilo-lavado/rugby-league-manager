import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');

  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://rugby-league-manager-backend.onrender.com/']
        : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // Swagger habilitado en todos los entornos excepto pruebas
  if (process.env.NODE_ENV !== 'test') {
    const config = new DocumentBuilder()
      .setTitle('Rugby League Manager API')
      .setDescription('Documentación de la API para gestión de ligas de rugby')
      .setVersion('1.0')
      .addTag('leagues')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      })
      .addServer(`http://localhost:${process.env.PORT || 3000}`, 'Local')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    logger.log(
      `📚 Swagger disponible en: http://localhost:${process.env.PORT || 3000}/api/docs`,
    );
  }

  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || '0.0.0.0';

  await app.listen(PORT, HOST);

  logger.log(`🚀 Servidor ejecutándose en: http://${HOST}:${PORT}`);
  logger.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap().catch((error) => {
  console.error('❌ Error durante el inicio de la aplicación:', error);
  process.exit(1);
});
