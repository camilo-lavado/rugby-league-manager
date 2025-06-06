import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { QueryPlayerDto } from './dto/query-player.dto';
import { User } from '../users/entities/user.entity';

describe('PlayersController', () => {
  let controller: PlayersController;
  let service: PlayersService;

  const mockPlayer = {
    id: 1,
    userId: 1,
    teamId: 1,
    user: { email: 'test@example.com' },
    team: { name: 'Team A' },
  };

  const mockUser: User = {
    id: 99,
    email: 'admin@example.com',
  } as User;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updatePlayer: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [{ provide: PlayersService, useValue: mockService }],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
    service = module.get<PlayersService>(PlayersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a player', async () => {
      const dto: CreatePlayerDto = {
        userId: 1,
        teamId: 1,
        positionId: 1,
        jerseyNumber: 10,
      };

      mockService.create.mockResolvedValue(mockPlayer);

      const result = await controller.create(dto, mockUser);
      expect(result).toEqual({ message: 'Jugador creado exitosamente', data: mockPlayer });
      expect(mockService.create).toHaveBeenCalledWith(dto, mockUser);
    });
  });

  describe('findAll', () => {
    it('should return paginated players list', async () => {
      const query: QueryPlayerDto = { page: 1, limit: 10 };
      const paginated = {
        data: [mockPlayer],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockService.findAll.mockResolvedValue(paginated);

      const result = await controller.findAll(query);
      expect(result).toEqual({
        message: 'Jugadores obtenidos correctamente',
        data: paginated.data,
        meta: {
          total: 1,
          page: 1,
          limit: 10,
        },
      });
    });

    it('should throw NotFoundException if no players found', async () => {
      mockService.findAll.mockResolvedValue({ data: [], total: 0, page: 1, limit: 10 });

      await expect(controller.findAll({})).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a player by ID', async () => {
      mockService.findById.mockResolvedValue(mockPlayer);

      const result = await controller.findOne(1);
      expect(result).toEqual({ message: 'Jugador encontrado', data: mockPlayer });
    });
  });

  describe('update', () => {
    it('should update a player and return the updated player', async () => {
      const dto: UpdatePlayerDto = { teamId: 2 };
      const updatedPlayer = { ...mockPlayer, ...dto };

      mockService.updatePlayer.mockResolvedValue(updatedPlayer);

      const result = await controller.update(1, dto, mockUser);
      expect(result).toEqual({ message: 'Jugador actualizado correctamente', data: updatedPlayer });
      expect(mockService.updatePlayer).toHaveBeenCalledWith(1, dto, mockUser);
    });
  });

  describe('remove', () => {
    it('should delete a player and return a success message', async () => {
      mockService.delete.mockResolvedValue(undefined);

      const result = await controller.remove(1, mockUser);
      expect(result).toEqual({ message: 'Jugador eliminado correctamente' });
      expect(mockService.delete).toHaveBeenCalledWith(1);
    });
  });
});
