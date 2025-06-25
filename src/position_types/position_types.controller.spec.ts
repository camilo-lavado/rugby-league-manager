import { Test, TestingModule } from '@nestjs/testing';
import { PositionTypesController } from './position_types.controller';
import { PositionTypesService } from './position_types.service';

describe('PositionTypesController', () => {
  let controller: PositionTypesController;
  let service: PositionTypesService;

  const mockPositionType = { id: 1, name: 'Forward' };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockPositionType),
    findAll: jest.fn().mockResolvedValue([mockPositionType]),
    findOne: jest.fn().mockResolvedValue(mockPositionType),
    update: jest.fn().mockResolvedValue({ ...mockPositionType, name: 'Hooker' }),
    remove: jest.fn().mockResolvedValue(mockPositionType),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionTypesController],
      providers: [
        {
          provide: PositionTypesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get(PositionTypesController);
    service = module.get(PositionTypesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a position type', async () => {
    const dto = { name: 'Forward',
      type: 'Attack'
     };
    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockPositionType);
  });

  it('should return all position types', async () => {
    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockPositionType]);
  });

  it('should return one position type', async () => {
    const result = await controller.findOne(1);

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockPositionType);
  });

  it('should update a position type', async () => {
    const result = await controller.update(1, { name: 'Hooker' });

    expect(service.update).toHaveBeenCalledWith(1, { name: 'Hooker' });
    expect(result).toEqual({ ...mockPositionType, name: 'Hooker' });
  });

  it('should remove a position type', async () => {
    const result = await controller.remove(1);

    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockPositionType);
  });
});
