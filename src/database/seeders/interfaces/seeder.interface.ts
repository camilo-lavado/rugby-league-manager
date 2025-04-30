// src/database/seeders/interfaces/seeder.interface.ts
export interface Seeder {
  /**
   * Ejecuta el proceso de seeding para una entidad o conjunto de entidades específicas
   * @returns Promise<any> - Puede devolver los elementos creados o void
   */
  seed(): Promise<any>;
}