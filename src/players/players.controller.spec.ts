import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

describe('PlayersController', () => {
  let controller: PlayersController;
  let service: PlayersService;

  const mockPlayer = {
    id: 1,
    userId: 1,
    teamId: 1,
    deletedAt: null,
    user: { email: 'test@example.com' },
    team: { name: 'Team A' },
  };

  const mockUser = {
    id: 99,
    email: 'admin@example.com',
  } as User;

  const mockPlayersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [
        {
          provide: PlayersService,
          useValue: mockPlayersService,
        },
      ],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
    service = module.get<PlayersService>(PlayersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debe crear un jugador y devolver mensaje y data', async () => {
      mockPlayersService.create.mockResolvedValue(mockPlayer);
  
      const createPlayerDto = {
        userId: 1,
        teamId: 1,
        positionId: 0,
        jerseyNumber: 0,
      };
  
      const result = await controller.create(createPlayerDto, mockUser);
  
      expect(mockPlayersService.create).toHaveBeenCalledWith(
        expect.objectContaining(createPlayerDto),
        expect.objectContaining({ id: mockUser.id, email: mockUser.email }),
      );
      expect(result).toEqual({
        message: 'Player created successfully',
        data: mockPlayer,
      });
    });
  });
  

  describe('findAll', () => {
    it('debe devolver lista paginada de jugadores', async () => {
      const mockResponse = {
        data: [mockPlayer],
        total: 1,
        page: 1,
        limit: 10,
      };
      mockPlayersService.findAll.mockResolvedValue(mockResponse);

      const query = { page: 1, limit: 10 };
      const result = await controller.findAll(query);

      expect(mockPlayersService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual({
        message: 'Players retrieved successfully',
        data: mockResponse.data,
        meta: {
          total: mockResponse.total,
          page: mockResponse.page,
          limit: mockResponse.limit,
        },
      });
    });

    it('debe lanzar NotFoundException si no hay jugadores', async () => {
      mockPlayersService.findAll.mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 });

      await expect(controller.findAll({})).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('debe devolver un jugador por ID', async () => {
      mockPlayersService.findById.mockResolvedValue(mockPlayer);

      const result = await controller.findOne(1);

      expect(mockPlayersService.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        message: 'Player retrieved successfully',
        data: mockPlayer,
      });
    });

    it('debe lanzar NotFoundException si el jugador no existe', async () => {
      mockPlayersService.findById.mockResolvedValue(null);

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar un jugador y devolver mensaje y data', async () => {
      const updateDto = { teamId: 2 };
      mockPlayersService.update.mockResolvedValue({ ...mockPlayer, ...updateDto });

      const result = await controller.update(1, updateDto, mockUser);

      expect(mockPlayersService.update).toHaveBeenCalledWith(1, updateDto, mockUser);
      expect(result).toEqual({
        message: 'Player updated successfully',
        data: { ...mockPlayer, ...updateDto },
      });
    });

    it('debe lanzar NotFoundException si no se actualiza el jugador', async () => {
      mockPlayersService.update.mockResolvedValue(null);

      await expect(controller.update(1, {}, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debe eliminar un jugador y devolver mensaje de éxito', async () => {
      mockPlayersService.delete.mockResolvedValue(undefined);

      const result = await controller.remove(1, mockUser);

      expect(mockPlayersService.delete).toHaveBeenCalledWith(1, mockUser);
      expect(result).toEqual({ message: 'Player deleted successfully' });
    });
  });
});
