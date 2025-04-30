// src/database/seeders/users/users-seeder.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../../users/entities/user.entity';

@Injectable()
export class UsersSeederService {
  private readonly logger = new Logger(UsersSeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    this.logger.log('Iniciando seeding de usuarios');
    
    // Verificar si ya existen usuarios para evitar duplicados
    const usersCount = await this.userRepository.count();
    if (usersCount > 0) {
      this.logger.log(`La base de datos ya contiene ${usersCount} usuarios. Saltando seeding de usuarios.`);
      return;
    }

    // Definir datos de usuarios iniciales
    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin' as UserRole,
      },
      {
        name: 'Test User',
        email: 'user@example.com',
        password: await bcrypt.hash('user123', 10),
        role: 'user' as UserRole,
      },
    ];

    try {
      // Guardar los usuarios en la base de datos
      const createdUsers = await Promise.all(
        users.map(async (user) => {
          const newUser = this.userRepository.create(user);
          return await this.userRepository.save(newUser);
        }),
      );

      this.logger.log(`Se crearon ${createdUsers.length} usuarios correctamente`);
      return createdUsers;
    } catch (error) {
      this.logger.error('Error al crear usuarios iniciales');
      throw error;
    }
  }
}