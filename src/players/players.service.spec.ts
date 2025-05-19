import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from './players.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PaginationService } from '../common/services/pagination.service';
import { User } from '../users/entities/user.entity';

describe('PlayersService', () => {
  let service: PlayersService;
  let repo: Repository<Player>;
  let paginationService: PaginationService;

  const mockRepo = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    softRemove: jest.fn(),
  };

  const mockPaginationService = {
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        {
          provide: getRepositoryToken(Player),
          useValue: mockRepo,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
    repo = module.get<Repository<Player>>(getRepositoryToken(Player));
    paginationService = module.get<PaginationService>(PaginationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new player if not exists', async () => {
      const dto = {
        userId: 10,
        teamId: 5,
        positionId: 2,
        jerseyNumber: 7,
      };
      const player = { id: 1, ...dto } as Player;

      mockRepo.findOne.mockResolvedValue(null); // No existe jugador previo
      mockRepo.create.mockReturnValue(player);
      mockRepo.save.mockResolvedValue(player);

      const result = await service.create(dto);

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { userId: dto.userId, teamId: dto.teamId, deletedAt: expect.anything() },
      });
      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalledWith(player);
      expect(result).toEqual(player);
    });

    it('should throw ConflictException if player already exists', async () => {
      const existingPlayer = { id: 1, userId: 10, teamId: 5 } as Player;
      mockRepo.findOne.mockResolvedValue(existingPlayer);

      await expect(
        service.create({
          userId: 10,
          teamId: 5,
          positionId: 1,
          jerseyNumber: 9,
        }),
      ).rejects.toThrow(ConflictException);

      expect(mockRepo.create).not.toHaveBeenCalled();
      expect(mockRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a player if found', async () => {
      const player = { id: 1 } as Player;
      mockRepo.findOne.mockResolvedValue(player);

      const result = await service.findById(1);

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1, deletedAt: expect.anything() },
        relations: ['user', 'team'],
      });
      expect(result).toEqual(player);
    });

    it('should throw NotFoundException if player not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a player if no conflicts', async () => {
      const dto = {
        userId: 20,
        teamId: 10,
        positionId: 3,
        jerseyNumber: 9,
      };

      const player = {
        id: 1,
        userId: 10,
        teamId: 5,
        positionId: 2,
        jerseyNumber: 7,
      } as Player;

      const updatedPlayer = { ...player, ...dto };

      // Mocks:
      mockRepo.findOne.mockResolvedValueOnce(player); // findById
      mockRepo.findOne.mockResolvedValueOnce(null); // check duplicados
      mockRepo.merge.mockImplementation((entity, data) => Object.assign(entity, data));
      mockRepo.save.mockResolvedValue(updatedPlayer);

      const result = await service.update(1, dto);

      expect(mockRepo.findOne).toHaveBeenNthCalledWith(1, {
        where: { id: 1, deletedAt: expect.anything() },
        relations: ['user', 'team'],
      });
      expect(mockRepo.findOne).toHaveBeenNthCalledWith(2, {
        where: { userId: dto.userId, teamId: dto.teamId, deletedAt: expect.anything() },
      });
      expect(mockRepo.merge).toHaveBeenCalledWith(player, dto);
      expect(mockRepo.save).toHaveBeenCalledWith(player);
      expect(result).toEqual(updatedPlayer);
    });

    it('should throw ConflictException if updated userId and teamId already exist in another player', async () => {
      const dto = { userId: 20, teamId: 10 };
      const player = { id: 1, userId: 10, teamId: 5 } as Player;
      const conflictingPlayer = { id: 2, userId: 20, teamId: 10 } as Player;

      mockRepo.findOne.mockResolvedValueOnce(player); // findById
      mockRepo.findOne.mockResolvedValueOnce(conflictingPlayer); // duplicado

      await expect(service.update(1, dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('delete', () => {
    it('should soft delete a player', async () => {
      const player = { id: 1, deletedAt: null, deletedBy: null } as unknown as Player;
      const user = { id: 99, email: 'admin@test.com' } as User;

      mockRepo.findOne.mockResolvedValue(player);
      mockRepo.save.mockResolvedValue(player);
      mockRepo.softRemove.mockResolvedValue(undefined);

      await service.delete(1, user);

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1, deletedAt: expect.anything() },
        relations: ['user', 'team'],
      });
      expect(player.deletedBy).toEqual(user);
      expect(player.deletedAt).toBeInstanceOf(Date);
      expect(mockRepo.save).toHaveBeenCalledWith(player);
      expect(mockRepo.softRemove).toHaveBeenCalledWith(player);
    });
  });
});
