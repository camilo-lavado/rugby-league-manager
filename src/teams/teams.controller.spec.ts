import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { QueryTeamDto } from './dto/query-team.dto';
import { User } from '../users/entities/user.entity';

describe('TeamsController', () => {
  let controller: TeamsController;
  let service: TeamsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updateTeam: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        {
          provide: TeamsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
    service = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a team', async () => {
    const dto: CreateTeamDto = { name: 'Team A', country: 'Chile', logoUrl: '', leagueId: 1 };
    const user = { id: 1, email: 'admin@test.com' } as User;
    const created = { id: 1, ...dto, createdBy: user };

    mockService.create.mockResolvedValue(created);

    const result = await controller.create(dto, user);

    expect(result).toEqual({ message: 'Equipo creado exitosamente', data: created });
    expect(mockService.create).toHaveBeenCalledWith(dto, user);
  });

  it('should return all teams', async () => {
    const query: QueryTeamDto = { page: 1, limit: 10 };
    const data = [{ id: 1, name: 'Team A' }];
    mockService.findAll.mockResolvedValue({ data, total: 1, page: 1, limit: 10 });

    const result = await controller.findAll(query);

    expect(result).toEqual({
      message: 'Equipos obtenidos correctamente',
      data,
      meta: { total: 1, page: 1, limit: 10 },
    });
    expect(mockService.findAll).toHaveBeenCalledWith(query);
  });

  it('should return one team by id', async () => {
    const team = { id: 1, name: 'Team A' };
    mockService.findById.mockResolvedValue(team);

    const result = await controller.findOne(1);

    expect(result).toEqual({ message: 'Equipo encontrado', data: team });
    expect(mockService.findById).toHaveBeenCalledWith(1);
  });

  it('should update a team', async () => {
    const dto: UpdateTeamDto = { name: 'Updated' };
    const user = { id: 1, email: 'admin@test.com' } as User;
    const updated = { id: 1, name: 'Updated', updatedBy: user };

    mockService.updateTeam.mockResolvedValue(updated);

    const result = await controller.update(1, dto, user);

    expect(result).toEqual({ message: 'Equipo actualizado correctamente', data: updated });
    expect(mockService.updateTeam).toHaveBeenCalledWith(1, dto, user);
  });

  it('should delete a team', async () => {
    mockService.delete.mockResolvedValue(undefined);

    const user = { id: 1, email: 'admin@test.com' } as User;
    const result = await controller.remove(1, user);

    expect(result).toEqual({ message: 'Equipo eliminado correctamente' });
    expect(mockService.delete).toHaveBeenCalledWith(1);
  });
});
