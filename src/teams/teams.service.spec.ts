import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Repository } from 'typeorm';
import { PaginationService } from '../common/services/pagination.service';
import { ConflictException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

describe('TeamsService', () => {
  let service: TeamsService;
  let repo: Repository<Team>;

  const mockRepo = {
    findAndCount: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
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
    repo = module.get<Repository<Team>>(getRepositoryToken(Team));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new team', async () => {
    const dto = { name: 'Team A', country: 'Chile', logoUrl: 'http://example.com/logo.png', leagueId: 1 };
    const user = { id: 99, email: 'admin@test.com' } as User;
    const team = { id: 1, ...dto, createdBy: user };

    mockRepo.findOneBy.mockResolvedValue(null);
    mockRepo.create.mockReturnValue(team);
    mockRepo.save.mockResolvedValue(team);

    const result = await service.create(dto, user);

    expect(result).toEqual(team);
    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Team A', createdBy: user }));
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('should throw conflict if team already exists', async () => {
    mockRepo.findOneBy.mockResolvedValue({ id: 1, name: 'Team A' });

    await expect(
      service.create({
        name: 'Team A', country: 'Chile',
        logoUrl: '',
        leagueId: 0
      }, {} as User),
    ).rejects.toThrow(ConflictException);
  });
});
