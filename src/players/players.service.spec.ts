import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from './players.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PaginationService } from '../common/services/pagination.service';
import { User } from '../users/entities/user.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

describe('PlayersService', () => {
  let service: PlayersService;
  let repo: jest.Mocked<Repository<Player>>;
  let paginationService: PaginationService;

  const mockUser: User = { 
    id: 99, 
    email: 'admin@test.com' 
  } as User;

  const mockPlayer: Player = {
    id: 1,
    userId: 1,
    teamId: 2,
    positionId: 3,
    jerseyNumber: 10,
    createdBy: mockUser,
  } as Player;

  const createMockRepo = (): jest.Mocked<Partial<Repository<Player>>> => ({
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    softRemove: jest.fn(),
  });

  const mockPaginationService = {
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        {
          provide: getRepositoryToken(Player),
          useValue: createMockRepo(),
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
    repo = module.get(getRepositoryToken(Player));
    paginationService = module.get<PaginationService>(PaginationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a player successfully when no duplicate exists', async () => {
      const dto: CreatePlayerDto = { 
        userId: 1, 
        teamId: 2, 
        positionId: 3, 
        jerseyNumber: 10 
      };

      repo.findOneBy.mockResolvedValueOnce(null);
      repo.create.mockReturnValueOnce(mockPlayer);
      repo.save.mockResolvedValueOnce(mockPlayer);

      const result = await service.create(dto, mockUser);

      expect(repo.findOneBy).toHaveBeenCalledWith({
        userId: dto.userId,
        teamId: dto.teamId,
      });
      expect(repo.create).toHaveBeenCalledWith({
        ...dto,
        createdBy: mockUser,
      });
      expect(repo.save).toHaveBeenCalledWith(mockPlayer);
      expect(result).toBe(mockPlayer);
    });

    it('should throw ConflictException when player already exists', async () => {
      const dto: CreatePlayerDto = { 
        userId: 1, 
        teamId: 2, 
        positionId: 3, 
        jerseyNumber: 10 
      };

      repo.findOneBy.mockResolvedValueOnce(mockPlayer);

      await expect(service.create(dto, mockUser)).rejects.toThrow(
        new ConflictException('Ya existe un registro con estos datos')
      );

      expect(repo.findOneBy).toHaveBeenCalledWith({
        userId: dto.userId,
        teamId: dto.teamId,
      });
      expect(repo.create).not.toHaveBeenCalled();
      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  describe('updatePlayer', () => {
    it('should update a player successfully when no conflicts', async () => {
      const dto: UpdatePlayerDto = { 
        userId: 2, 
        teamId: 3,
        jerseyNumber: 15
      };
      const existingPlayer = { ...mockPlayer };
      const updatedPlayer = { 
        ...existingPlayer, 
        ...dto, 
        updatedBy: mockUser 
      };

      repo.findOneBy
        .mockResolvedValueOnce(existingPlayer) // First call - find existing player
        .mockResolvedValueOnce(null); // Second call - check for duplicates
      repo.merge.mockReturnValueOnce(updatedPlayer);
      repo.save.mockResolvedValueOnce(updatedPlayer);

      const result = await service.updatePlayer(1, dto, mockUser);

      expect(repo.findOneBy).toHaveBeenNthCalledWith(1, { id: 1 });
      expect(repo.findOneBy).toHaveBeenNthCalledWith(2, {
        userId: dto.userId,
        teamId: dto.teamId,
      });
      expect(repo.merge).toHaveBeenCalledWith(existingPlayer, {
        ...dto,
        updatedBy: mockUser,
      });
      expect(repo.save).toHaveBeenCalledWith(updatedPlayer);
      expect(result).toBe(updatedPlayer);
    });

    it('should update a player when only some fields are provided', async () => {
      const dto: UpdatePlayerDto = { 
        jerseyNumber: 20
      };
      const existingPlayer = { ...mockPlayer };
      const updatedPlayer = { 
        ...existingPlayer, 
        ...dto, 
        updatedBy: mockUser 
      };

      repo.findOneBy.mockResolvedValueOnce(existingPlayer);
      repo.merge.mockReturnValueOnce(updatedPlayer);
      repo.save.mockResolvedValueOnce(updatedPlayer);

      const result = await service.updatePlayer(1, dto, mockUser);

      expect(repo.findOneBy).toHaveBeenCalledTimes(1);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repo.merge).toHaveBeenCalledWith(existingPlayer, {
        ...dto,
        updatedBy: mockUser,
      });
      expect(result).toBe(updatedPlayer);
    });

    it('should throw NotFoundException when player does not exist', async () => {
      const dto: UpdatePlayerDto = { jerseyNumber: 15 };

      repo.findOneBy.mockResolvedValueOnce(null);

      await expect(service.updatePlayer(999, dto, mockUser)).rejects.toThrow(
        new NotFoundException('No se encontró el registro con ID 999')
      );

      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(repo.merge).not.toHaveBeenCalled();
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when duplicate player exists', async () => {
      const dto: UpdatePlayerDto = { 
        userId: 2, 
        teamId: 3 
      };
      const existingPlayer = { ...mockPlayer };
      const duplicatePlayer = { 
        id: 2, 
        userId: 2, 
        teamId: 3 
      } as Player;

      repo.findOneBy
        .mockResolvedValueOnce(existingPlayer) // First call - find existing player
        .mockResolvedValueOnce(duplicatePlayer); // Second call - find duplicate

      await expect(service.updatePlayer(1, dto, mockUser)).rejects.toThrow(
        new ConflictException('Ya existe un registro con estos datos')
      );

      expect(repo.findOneBy).toHaveBeenNthCalledWith(1, { id: 1 });
      expect(repo.findOneBy).toHaveBeenNthCalledWith(2, {
        userId: dto.userId,
        teamId: dto.teamId,
      });
      expect(repo.merge).not.toHaveBeenCalled();
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('should allow updating to same userId/teamId combination (same player)', async () => {
      const dto: UpdatePlayerDto = { 
        userId: 1, 
        teamId: 2, // Same as existing player
        jerseyNumber: 15
      };
      const existingPlayer = { ...mockPlayer };
      const samePlayer = { ...mockPlayer }; // Same player found as "duplicate"
      const updatedPlayer = { 
        ...existingPlayer, 
        ...dto, 
        updatedBy: mockUser 
      };

      repo.findOneBy
        .mockResolvedValueOnce(existingPlayer) // First call - find existing player
        .mockResolvedValueOnce(samePlayer); // Second call - finds same player
      repo.merge.mockReturnValueOnce(updatedPlayer);
      repo.save.mockResolvedValueOnce(updatedPlayer);

      const result = await service.updatePlayer(1, dto, mockUser);

      expect(repo.findOneBy).toHaveBeenNthCalledWith(1, { id: 1 });
      expect(repo.findOneBy).toHaveBeenNthCalledWith(2, {
        userId: dto.userId,
        teamId: dto.teamId,
      });
      expect(repo.merge).toHaveBeenCalledWith(existingPlayer, {
        ...dto,
        updatedBy: mockUser,
      });
      expect(result).toBe(updatedPlayer);
    });
  });

  describe('inherited methods from BaseCrudService', () => {
    it('should call findById from base service', async () => {
      const player = { ...mockPlayer };
      
      // Mock the findById method that should be inherited from BaseCrudService
      jest.spyOn(service, 'findById').mockResolvedValueOnce(player);

      const result = await service.findById(1);

      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result).toBe(player);
    });

    it('should call findAll from base service', async () => {
      const paginatedResult = {
        data: [mockPlayer],
        total: 1,
        page: 1,
        limit: 10,
      };

      // Mock the findAll method that should be inherited from BaseCrudService
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(paginatedResult);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
      expect(result).toBe(paginatedResult);
    });

    it('should call delete from base service', async () => {
      // Mock the delete method that should be inherited from BaseCrudService
      jest.spyOn(service, 'delete').mockResolvedValueOnce(undefined);

      await service.delete(1);

      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});