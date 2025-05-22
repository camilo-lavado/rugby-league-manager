import { Test, TestingModule } from '@nestjs/testing';
import { PositionTypesController } from './position_types.controller';
import { PositionTypesService } from './position_types.service';

describe('PositionTypesController', () => {
  let controller: PositionTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionTypesController],
      providers: [PositionTypesService],
    }).compile();

    controller = module.get<PositionTypesController>(PositionTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
