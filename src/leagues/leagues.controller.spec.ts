import { Test, TestingModule } from '@nestjs/testing';
import { LeaguesController } from './leagues.controller';
import { LeaguesService } from './leagues.service';

describe('LeaguesController', () => {
  let controller: LeaguesController;

  const mockLeaguesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaguesController],
      providers: [
        {
          provide: LeaguesService,
          useValue: mockLeaguesService,
        },
      ],
    }).compile();

    controller = module.get<LeaguesController>(LeaguesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Aquí agregar más tests 
});
