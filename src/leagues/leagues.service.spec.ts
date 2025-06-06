import { Test, TestingModule } from '@nestjs/testing';
import { LeaguesService } from './leagues.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { League } from './league.entity';
import { Repository } from 'typeorm';
import { PaginationService } from '../common/services/pagination.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

describe('LeaguesService', () => {
  let service: LeaguesService;
  let repo: jest.Mocked<Repository<League>>;

  const mockRepo = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    softRemove: jest.fn(),
    findOne: jest.fn(),
    restore: jest.fn(),
  };

  const mockPaginationService = {
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(require('@nestjs/common').Logger.prototype, 'error').mockImplementation(() => {});
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
    repo = module.get(getRepositoryToken(League));
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

  it('should updateWithUser properly', async () => {
    const user = { id: 1, email: 'admin@test.com' } as User;
    const dto = { name: 'Updated' };

    mockRepo.findOneBy.mockImplementation((query) => {
      if ('id' in query) return Promise.resolve({ id: 1, name: 'Old' });
      if ('name' in query) return Promise.resolve(null);
    });

    const merged = { id: 1, name: 'Updated', updatedBy: user };
    mockRepo.merge.mockReturnValue(merged);
    mockRepo.save.mockResolvedValue(merged);

    const result = await service.updateWithUser(1, dto, user);

    expect(result).toEqual(merged);
  });

  it('should throw conflict in updateWithUser if name exists', async () => {
    const user = { id: 1, email: 'admin@test.com' } as User;

    mockRepo.findOneBy.mockImplementation((query) => {
      if ('id' in query) return Promise.resolve({ id: 1, name: 'Old' });
      if ('name' in query) return Promise.resolve({ id: 2, name: 'Duplicada' });
    });

    await expect(
      service.updateWithUser(1, { name: 'Duplicada' }, user),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw NotFoundException if league not found for update', async () => {
    mockRepo.findOneBy.mockImplementation((query) => {
      if ('id' in query) return Promise.resolve(null);
    });

    await expect(
      service.updateWithUser(999, { name: 'Nueva' }, {} as User),
    ).rejects.toThrow(NotFoundException);
  });
});
