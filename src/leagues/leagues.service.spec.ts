import { Test, TestingModule } from '@nestjs/testing';
import { LeaguesService } from './leagues.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { League } from './league.entity';
import { Repository } from 'typeorm';
import { PaginationService } from '../common/services/pagination.service';
import { ConflictException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

describe('LeaguesService', () => {
  let service: LeaguesService;
  let repo: Repository<League>;

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
        LeaguesService,
        {
          provide: getRepositoryToken(League),
          useValue: mockRepo,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
      ],
    }).compile();

    service = module.get<LeaguesService>(LeaguesService);
    repo = module.get<Repository<League>>(getRepositoryToken(League));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new league', async () => {
    const dto = { name: 'Liga A', country: 'Chile' };
    const user = { id: 99, email: 'admin@test.com' } as User;
    const league = { id: 1, ...dto, createdBy: user };

    mockRepo.findOneBy.mockResolvedValue(null);
    mockRepo.create.mockReturnValue(league);
    mockRepo.save.mockResolvedValue(league);

    const result = await service.create(dto, user);

    expect(result).toEqual(league);
    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Liga A', createdBy: user }));
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('should throw conflict if league already exists', async () => {
    mockRepo.findOneBy.mockResolvedValue({ id: 1, name: 'Liga A' });

    await expect(
      service.create({ name: 'Liga A', country: 'Chile' }, {} as User),
    ).rejects.toThrow(ConflictException);
  });
});
