import { Test, TestingModule } from '@nestjs/testing';
import { PositionTypesController } from './position_types.controller';
import { PositionTypesService } from './position_types.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PositionType } from './entities/position_type.entity';
import { PaginationService } from '../common/services/pagination.service';
import { Repository } from 'typeorm';

describe('PositionTypesController', () => {
  let controller: PositionTypesController;
  let service: PositionTypesService;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softRemove: jest.fn(),
    merge: jest.fn(),
  };

  const mockPaginationService = {
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionTypesController],
      providers: [
        PositionTypesService,
        {
          provide: getRepositoryToken(PositionType),
          useValue: mockRepository,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
      ],
    }).compile();

    controller = module.get<PositionTypesController>(PositionTypesController);
    service = module.get<PositionTypesService>(PositionTypesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
