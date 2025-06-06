import { Test, TestingModule } from '@nestjs/testing';
import { Repository, UpdateResult } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { BaseCrudService } from './base-crud.service';
import { PaginationService } from './pagination.service';

class TestEntity {
  id: number;
  name: string;
  deletedAt?: Date;
}

class MockCrudService extends BaseCrudService<TestEntity> {}

describe('BaseCrudService', () => {
  let service: MockCrudService;
  let repository: jest.Mocked<Repository<TestEntity>>;

  const mockPaginationService = {
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    const mockRepo = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      softRemove: jest.fn(),
      restore: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
        {
          provide: 'Repository',
          useValue: mockRepo,
        },
        {
          provide: MockCrudService,
          useFactory: () =>
            new MockCrudService(
              mockRepo as any as Repository<TestEntity>,
              mockPaginationService,
            ),
        },
      ],
    }).compile();

    service = module.get<MockCrudService>(MockCrudService);
    repository = module.get('Repository');
  });

  afterEach(() => jest.clearAllMocks());

  it('should create a new entity', async () => {
    const dto = { name: 'Test Entity' };
    const entity = { id: 1, ...dto };

    repository.findOneBy.mockResolvedValue(null);
    repository.create.mockReturnValue(entity);
    repository.save.mockResolvedValue(entity);

    const result = await service.create(dto);

    expect(result).toEqual(entity);
    expect(repository.save).toHaveBeenCalledWith(entity);
  });

  it('should throw ConflictException if entity exists', async () => {
    repository.findOneBy.mockResolvedValue({ id: 1, name: 'Existing' });

    await expect(
      service.create({ name: 'Existing' }, { name: 'Existing' }),
    ).rejects.toThrow(ConflictException);
  });

  it('should find entity by ID', async () => {
    const entity = { id: 1, name: 'Sample' };
    repository.findOneBy.mockResolvedValue(entity);

    const result = await service.findById(1);
    expect(result).toEqual(entity);
  });

  it('should throw NotFoundException if entity not found', async () => {
    repository.findOneBy.mockResolvedValue(null);
    await expect(service.findById(99)).rejects.toThrow(NotFoundException);
  });

  it('should update an entity', async () => {
    const entity = { id: 1, name: 'Old' };
    const merged = { id: 1, name: 'Updated' };

    repository.findOneBy.mockResolvedValue(entity);
    repository.merge.mockReturnValue(merged);
    repository.save.mockResolvedValue(merged);

    const result = await service.update(1, { name: 'Updated' });

    expect(result).toEqual(merged);
  });

  it('should soft delete an entity', async () => {
    const entity = { id: 1, name: 'ToDelete' };

    repository.findOneBy.mockResolvedValue(entity);
    repository.save.mockResolvedValue({ ...entity, deletedAt: new Date() });
    repository.softRemove.mockResolvedValue({ ...entity, deletedAt: new Date() });

    await service.delete(1);

    expect(repository.save).toHaveBeenCalled();
    expect(repository.softRemove).toHaveBeenCalled();
  });

  it('should restore an entity', async () => {
    const result: UpdateResult = { affected: 1, generatedMaps: [], raw: [] };
    repository.restore.mockResolvedValue(result);

    await service.restore(1);
    expect(repository.restore).toHaveBeenCalledWith(1);
  });
});
