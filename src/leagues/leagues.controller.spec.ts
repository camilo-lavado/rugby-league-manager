import { Test, TestingModule } from '@nestjs/testing';
import { LeaguesController } from './leagues.controller';
import { LeaguesService } from './leagues.service';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { User } from '../users/entities/user.entity';

describe('LeaguesController', () => {
  let controller: LeaguesController;
  let service: LeaguesService;

  const mockLeaguesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updateWithUser: jest.fn(),
    deleteWithUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(require('@nestjs/common').Logger.prototype, 'error').mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaguesController],
      providers: [
        {
          provide: LeaguesService,
          useValue: mockLeaguesService,
        },
      ],
    }).compile();

    controller = module.get<LeaguesController>(LeaguesController);
    service = module.get<LeaguesService>(LeaguesService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('update', () => {
    it('should call service.updateWithUser and return the result', async () => {
      const user = { id: 1, email: 'admin@test.com' } as User;
      const dto: UpdateLeagueDto = { name: 'Updated League' };
      const expectedLeague = {
        id: 1,
        name: 'Updated League',
        updatedBy: user,
      };
  
      mockLeaguesService.updateWithUser.mockResolvedValue(expectedLeague);
  
      const result = await controller.update(1, dto, user);
  
      expect(service.updateWithUser).toHaveBeenCalledWith(1, dto, user);
      expect(result).toEqual({
        message: 'Liga actualizada exitosamente',
        data: expectedLeague,
      });
    });
  });
  

  describe('delete', () => {
    it('should call service.deleteWithUser with correct arguments', async () => {
      const user = { id: 1, email: 'admin@test.com' } as User;

      mockLeaguesService.deleteWithUser.mockResolvedValue(undefined);

      await controller.delete(1, user);

      expect(service.deleteWithUser).toHaveBeenCalledWith(1, user);
    });
  });
});
