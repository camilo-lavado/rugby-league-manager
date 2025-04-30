import { Test, TestingModule } from '@nestjs/testing';
import { TestController } from './test.controller';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { APP_GUARD } from '@nestjs/core';

describe('TestController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
      imports: [
        ThrottlerModule.forRoot({
          throttlers: [
            {
              ttl: 10000,
              limit: 5,
            },
          ],
        }),
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    const controller = app.get<TestController>(TestController);
    expect(controller).toBeDefined();
  });

  describe('GET /test/throttle', () => {
    it('should return a message when the limit is not exceeded', async () => {
      const response = await request(app.getHttpServer()).get('/test/throttle');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Ruta de prueba de Throttle!');
    });

    it('should throttle the requests after 5 requests within 10 seconds', async () => {
      // Realizar 5 solicitudes permitidas secuencialmente
      for (let i = 0; i < 5; i++) {
        const response = await request(app.getHttpServer()).get('/test/throttle');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Ruta de prueba de Throttle!');
      }

      // La sexta solicitud debería ser rechazada
      const delayedResponse = await request(app.getHttpServer()).get('/test/throttle');
      expect(delayedResponse.status).toBe(429); // "Too Many Requests"
    });
  });

  describe('GET /test/unlimited', () => {
    it('should return a message without throttling', async () => {
      const response = await request(app.getHttpServer()).get('/test/unlimited');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Ruta de prueba sin Throttle!');
    });

    it('should allow multiple requests without throttling', async () => {
      for (let i = 0; i < 10; i++) {
        const response = await request(app.getHttpServer()).get('/test/unlimited');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Ruta de prueba sin Throttle!');
      }
    });
  });

  afterAll(async () => {
    await app.close();
  });
});