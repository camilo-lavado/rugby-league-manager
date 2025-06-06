import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { PaginationService } from '../common/services/pagination.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repo: Repository<Category>;

  const mockRepo = {
    findAndCount: jest.fn(),
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
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepo,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repo = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new category', async () => {
    const dto = { name: 'Professional', type: 'league' };
    const user = { id: 99, email: 'admin@test.com' } as User;
    const category = { id: 1, ...dto, createdBy: user };

    mockRepo.findOneBy.mockResolvedValue(null);
    mockRepo.create.mockReturnValue(category);
    mockRepo.save.mockResolvedValue(category);

    const result = await service.create(dto, user);

    expect(result).toEqual(category);
    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Professional', createdBy: user }));
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('should throw conflict if category already exists', async () => {
    mockRepo.findOneBy.mockResolvedValue({ id: 1, name: 'Professional', type: 'league' });

    await expect(
      service.create({ name: 'Professional', type: 'league' }, {} as User),
    ).rejects.toThrow(ConflictException);
  });

  describe('updateCategory', () => {
    const user = { id: 1, email: 'admin@test.com' } as User;

    it('should update a category successfully', async () => {
      const id = 1;
      const dto: UpdateCategoryDto = { name: 'Updated', type: 'league' };
      const existing = { id, name: 'Old', type: 'league' };

      mockRepo.findOneBy
        .mockResolvedValueOnce(existing) // find by ID
        .mockResolvedValueOnce(null);   // no duplicate

      mockRepo.merge.mockReturnValue({ ...existing, ...dto, updatedBy: user });
      mockRepo.save.mockResolvedValue({ ...existing, ...dto, updatedBy: user });

      const result = await service.updateCategory(id, dto, user);

      expect(mockRepo.merge).toHaveBeenCalledWith(existing, expect.objectContaining({ name: 'Updated' }));
      expect(result).toEqual({ ...existing, ...dto, updatedBy: user });
    });

    it('should throw NotFoundException if category not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.updateCategory(999, { name: 'X' }, {} as User)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if name already exists in another category', async () => {
      const id = 1;
      const dto: UpdateCategoryDto = { name: 'Existing', type: 'league' };
      const existing = { id, name: 'Original', type: 'league' };
      const duplicate = { id: 2, name: 'Existing', type: 'league' };

      mockRepo.findOneBy
        .mockResolvedValueOnce(existing) // find by ID
        .mockResolvedValueOnce(duplicate); // duplicate name

      await expect(service.updateCategory(id, dto, user)).rejects.toThrow(ConflictException);
    });
  });
});
