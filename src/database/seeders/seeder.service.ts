// src/database/seeders/seeder.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { UsersSeederService } from './users/users-seeder.service';
import { LeaguesSeederService } from './leagues/leagues-seeder.service';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly usersSeederService: UsersSeederService,
    private readonly leaguesSeederService: LeaguesSeederService,
  ) {}

  async seed() {
    try {
      this.logger.log('Iniciando proceso de seeding...');
      
      // El orden es importante - primero usuarios, luego ligas que dependen de usuarios
      await this.usersSeederService.seed();
      await this.leaguesSeederService.seed();
      
      this.logger.log('Proceso de seeding completado exitosamente');
    } catch (error) {
      this.logger.error('Error durante el proceso de seeding');
      this.logger.error(error);
    }
  }
}