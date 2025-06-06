import { Test, TestingModule } from '@nestjs/testing';
import { BaseCrudController } from './base-crud.controller';
import { NotFoundException } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

class TestEntity {
  id: number;
  name: string;
}

class CreateTestDto {
  name: string;
}

class UpdateTestDto {
  name: string;
}

class QueryTestDto {
  page?: number;
  limit?: number;
  search?: string;
}

describe('BaseCrudController', () => {
  let controller: BaseCrudController<
    TestEntity,
    CreateTestDto,
    UpdateTestDto,
    QueryTestDto
  >;
  let mockService: any;

  const mockUser: User = {
    id: 1,
    name: 'Admin Test',
    email: 'admin@test.com',
    password: 'hashedpass',
    role: 'admin',
  };

  beforeEach(async () => {
    mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    class ConcreteController extends BaseCrudController<
      TestEntity,
      CreateTestDto,
      UpdateTestDto,
      QueryTestDto
    > {
      constructor() {
        super(mockService);
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcreteController],
      providers: [{ provide: 'MockService', useValue: mockService }],
    }).compile();

    controller = module.get<ConcreteController>(ConcreteController);
  });

  it('should create an item', async () => {
    const dto = { name: 'Test' };
    const entity = { id: 1, name: 'Test' };
    mockService.create.mockResolvedValue(entity);

    const result = await controller.create(dto, mockUser);
    expect(result).toEqual({ message: 'Elemento creado exitosamente', data: entity });
  });

  it('should return all items with meta', async () => {
    const query = { page: 1, limit: 10 };
    const data = [{ id: 1, name: 'Test' }];
    mockService.findAll.mockResolvedValue({
      data,
      total: 1,
      page: 1,
      limit: 10,
    });

    const result = await controller.findAll(query);
    expect(result).toEqual({
      message: 'Elementos obtenidos exitosamente',
      data,
      meta: { total: 1, page: 1, limit: 10 },
    });
  });

  it('should throw if findAll returns empty', async () => {
    mockService.findAll.mockResolvedValue({ data: [] });
    await expect(controller.findAll({})).rejects.toThrow(NotFoundException);
  });

  it('should return one item', async () => {
    const entity = { id: 1, name: 'Test' };
    mockService.findById.mockResolvedValue(entity);

    const result = await controller.findOne(1);
    expect(result).toEqual({ message: 'Elemento encontrado', data: entity });
  });

  it('should update an item', async () => {
    const dto = { name: 'Updated' };
    const entity = { id: 1, name: 'Updated' };
    mockService.update.mockResolvedValue(entity);

    const result = await controller.update(1, dto, mockUser);
    expect(result).toEqual({
      message: 'Elemento actualizado exitosamente',
      data: entity,
    });
  });

  it('should throw NotFoundException if update returns null', async () => {
    mockService.update.mockResolvedValue(null);
    await expect(controller.update(99, { name: 'x' }, mockUser)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete an item', async () => {
    mockService.delete.mockResolvedValue(undefined);
    const result = await controller.delete(1, mockUser);
    expect(result).toEqual({ message: 'Elemento eliminado exitosamente' });
  });
});
