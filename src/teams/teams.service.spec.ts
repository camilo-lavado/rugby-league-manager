import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Repository } from 'typeorm';
import { PaginationService } from '../common/services/pagination.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

describe('TeamsService', () => {
  let service: TeamsService;
  let repo: jest.Mocked<Repository<Team>>;

  const mockRepo = {
    findAndCount: jest.fn(),
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
        TeamsService,
        {
          provide: getRepositoryToken(Team),
          useValue: mockRepo,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
    repo = module.get(getRepositoryToken(Team));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new team', async () => {
      const dto = {
        name: 'Team A',
        country: 'Chile',
        logoUrl: 'http://example.com/logo.png',
        leagueId: 1,
      };
      const user = { id: 1, email: 'admin@test.com' } as User;
      const team = { id: 1, ...dto, createdBy: user };

      mockRepo.findOneBy.mockResolvedValue(null);
      mockRepo.create.mockReturnValue(team);
      mockRepo.save.mockResolvedValue(team);

      const result = await service.create(dto, user);

      expect(result).toEqual(team);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ name: dto.name });
      expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({ name: dto.name, createdBy: user }));
      expect(mockRepo.save).toHaveBeenCalledWith(team);
    });

    it('should throw ConflictException if name already exists', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: 1, name: 'Team A' });

      await expect(
        service.create({ name: 'Team A', country: 'Chile', logoUrl: '', leagueId: 0 }, {} as User),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('updateTeam', () => {
    it('should update an existing team', async () => {
      const dto = { name: 'Updated', country: 'Chile' };
      const user = { id: 1, email: 'admin@test.com' } as User;
      const existing = { id: 1, name: 'Old', country: 'Chile' };

      mockRepo.findOneBy.mockImplementation(({ id, name }) => {
        if (id === 1) return Promise.resolve(existing);
        if (name === dto.name) return Promise.resolve(null);
        return Promise.resolve(null);
      });

      const merged = { ...existing, ...dto, updatedBy: user };
      mockRepo.merge.mockReturnValue(merged);
      mockRepo.save.mockResolvedValue(merged);

      const result = await service.updateTeam(1, dto, user);

      expect(result).toEqual(merged);
      expect(mockRepo.merge).toHaveBeenCalledWith(existing, { ...dto, updatedBy: user });
      expect(mockRepo.save).toHaveBeenCalledWith(merged);
    });

    it('should throw NotFoundException if team not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(
        service.updateTeam(99, { name: 'Missing' }, {} as User),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if name is duplicated', async () => {
      mockRepo.findOneBy
        .mockResolvedValueOnce({ id: 1, name: 'Old Team' }) // find by id
        .mockResolvedValueOnce({ id: 2, name: 'Duplicated' }); // find by name

      await expect(
        service.updateTeam(1, { name: 'Duplicated' }, {} as User),
      ).rejects.toThrow(ConflictException);
    });
  });
});
