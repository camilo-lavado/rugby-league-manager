import { Test, TestingModule } from '@nestjs/testing';
import { PositionTypesService } from './position_types.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PositionType } from './entities/position_type.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('PositionTypesService', () => {
  let service: PositionTypesService;
  let repo: jest.Mocked<Repository<PositionType>>;

  const mockPositionType = { id: 1, name: 'Forward' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositionTypesService,
        {
          provide: getRepositoryToken(PositionType),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            merge: jest.fn(),
            softRemove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(PositionTypesService);
    repo = module.get(getRepositoryToken(PositionType));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a position type', async () => {
    repo.create.mockReturnValueOnce(mockPositionType as PositionType);
    repo.save.mockResolvedValueOnce(mockPositionType as PositionType);

    const result = await service.create({ name: 'Forward',
      type: 'Attack'
     });

    expect(repo.create).toHaveBeenCalledWith({ name: 'Forward',
      type: 'Attack'
     });
    expect(repo.save).toHaveBeenCalledWith(mockPositionType);
    expect(result).toEqual(mockPositionType);
  });

  it('should return all position types', async () => {
    repo.find.mockResolvedValueOnce([mockPositionType as PositionType]);

    const result = await service.findAll();

    expect(repo.find).toHaveBeenCalled();
    expect(result).toEqual([mockPositionType]);
  });

  it('should return a position type by ID', async () => {
    repo.findOneBy.mockResolvedValueOnce(mockPositionType as PositionType);

    const result = await service.findOne(1);

    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(mockPositionType);
  });

  it('should throw if position type not found', async () => {
    repo.findOneBy.mockResolvedValueOnce(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a position type', async () => {
    const updated = { id: 1, name: 'Hooker' };

    repo.findOneBy.mockResolvedValueOnce(mockPositionType as PositionType);
    repo.merge.mockReturnValueOnce(updated as PositionType);
    repo.save.mockResolvedValueOnce(updated as PositionType);

    const result = await service.update(1, { name: 'Hooker' });

    expect(repo.merge).toHaveBeenCalledWith(mockPositionType, { name: 'Hooker' });
    expect(result).toEqual(updated);
  });

  it('should delete a position type', async () => {
    repo.findOneBy.mockResolvedValueOnce(mockPositionType as PositionType);
    repo.softRemove.mockResolvedValueOnce(mockPositionType as PositionType);

    const result = await service.remove(1);

    expect(repo.softRemove).toHaveBeenCalledWith(mockPositionType);
    expect(result).toEqual(mockPositionType);
  });
});
