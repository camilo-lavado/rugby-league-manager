import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { User } from '../users/entities/user.entity';
import { Category } from './entities/category.entity';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updateCategory: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('update', () => {
    it('should call service.updateCategory and return updated data', async () => {
      const id = 1;
      const dto: UpdateCategoryDto = { name: 'Updated Category' };
      const user = { id: 1, email: 'admin@test.com' } as User;

      const updatedCategory = {
        id,
        name: 'Updated Category',
        updatedBy: user,
      } as Category;

      mockCategoriesService.updateCategory.mockResolvedValue(updatedCategory);

      const result = await controller.update(id, dto, user);

      expect(mockCategoriesService.updateCategory).toHaveBeenCalledWith(id, dto, user);
      expect(result).toEqual({
        message: 'Categoría actualizada exitosamente',
        data: updatedCategory,
      });
    });
  });
});
