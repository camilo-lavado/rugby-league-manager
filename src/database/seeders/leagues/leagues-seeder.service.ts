// src/database/seeders/leagues/leagues-seeder.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { League } from '../../../leagues/league.entity';
import { User } from '../../../users/entities/user.entity';

@Injectable()
export class LeaguesSeederService {
  private readonly logger = new Logger(LeaguesSeederService.name);

  constructor(
    @InjectRepository(League)
    private readonly leagueRepository: Repository<League>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    this.logger.log('Iniciando seeding de ligas');
    
    // Verificar si ya existen ligas para evitar duplicados
    const leaguesCount = await this.leagueRepository.count();
    if (leaguesCount > 0) {
      this.logger.log(`La base de datos ya contiene ${leaguesCount} ligas. Saltando seeding de ligas.`);
      return;
    }

    // Obtener el usuario admin para asociarlo como creador
    const adminUser = await this.userRepository.findOneBy({ 
      email: 'admin@example.com' 
    });

    if (!adminUser) {
      this.logger.warn('No se encontró un usuario admin para asociar como creador de ligas');
      return;
    }

    // Definir datos de ligas iniciales
    const leagues = [
      {
        name: 'Super Rugby',
        country: 'Internacional',
        createdBy: adminUser,
      },
      {
        name: 'Premiership Rugby',
        country: 'Inglaterra',
        createdBy: adminUser,
      },
      {
        name: 'Top 14',
        country: 'Francia',
        createdBy: adminUser,
      },
      {
        name: 'United Rugby Championship',
        country: 'Internacional',
        createdBy: adminUser,
      },
      {
        name: 'Rugby Championship',
        country: 'Internacional',
        createdBy: adminUser,
      },
    ];

    try {
      // Guardar las ligas en la base de datos
      const createdLeagues = await Promise.all(
        leagues.map(async (league) => {
          const newLeague = this.leagueRepository.create(league);
          return await this.leagueRepository.save(newLeague);
        }),
      );

      this.logger.log(`Se crearon ${createdLeagues.length} ligas correctamente`);
      return createdLeagues;
    } catch (error) {
      this.logger.error('Error al crear ligas iniciales');
      throw error;
    }
  }
}