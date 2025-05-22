import { Test, TestingModule } from '@nestjs/testing';
import { PositionsService } from './positions.service';
import { Position } from './entities/position.entity';
import { PaginationService } from '../common/services/pagination.service';

describe('PositionsService', () => {
  let service: PositionsService;

  beforeEach(async () => {
    const mockPositionRepository = {};

    class MockPaginationService {}

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositionsService,
        { provide: 'PositionRepository', useValue: mockPositionRepository },
        { provide: PaginationService, useClass: MockPaginationService }, // Use the actual class as token
      ],
    }).compile();

    service = module.get<PositionsService>(PositionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
