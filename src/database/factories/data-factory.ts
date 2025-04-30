// src/database/factories/data-factory.ts
import { User, UserRole } from '../../users/entities/user.entity';
import { League } from '../../leagues/league.entity';
import * as bcrypt from 'bcrypt';

/**
 * Clase de fábrica para generar datos de prueba
 */
export class DataFactory {
  /**
   * Crea datos de usuario para testing
   * @param overrides - Propiedades personalizadas para sobreescribir los valores predeterminados
   */
  static async createUserData(overrides: Partial<User> = {}): Promise<Partial<User>> {
    // Generar un nombre aleatorio si no se proporciona uno
    const randomNum = Math.floor(Math.random() * 1000);
    
    return {
      name: `User ${randomNum}`,
      email: `user${randomNum}@example.com`,
      password: await bcrypt.hash('password123', 10),
      role: 'user' as UserRole,
      ...overrides,
    };
  }

  /**
   * Crea datos de liga para testing
   * @param overrides - Propiedades personalizadas para sobreescribir los valores predeterminados
   */
  static createLeagueData(overrides: Partial<League> = {}): Partial<League> {
    const countries = ['España', 'Francia', 'Inglaterra', 'Argentina', 'Nueva Zelanda', 'Sudáfrica', 'Australia'];
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const randomNum = Math.floor(Math.random() * 1000);
    
    return {
      name: `League ${randomNum}`,
      country: randomCountry,
      ...overrides,
    };
  }
}