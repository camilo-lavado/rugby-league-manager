#!/usr/bin/env node
// scripts/create-seeder.js
const fs = require('fs');
const path = require('path');

// Obtener el nombre del módulo desde los argumentos
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Por favor proporciona un nombre para el seeder: npm run create:seeder -- nombre-modulo');
  process.exit(1);
}

const moduleName = args[0];
const moduleNameCapitalized = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
const moduleNamePlural = `${moduleName}s`;
const moduleNamePluralCapitalized = `${moduleNameCapitalized}s`;

// Crear las rutas y carpetas necesarias
const seedersDir = path.join(__dirname, '..', 'src', 'database', 'seeders');
const moduleDir = path.join(seedersDir, moduleNamePlural);

if (!fs.existsSync(moduleDir)) {
  fs.mkdirSync(moduleDir, { recursive: true });
}

// Crear el contenido del módulo seeder
const moduleContent = `// src/database/seeders/${moduleNamePlural}/${moduleName}s-seeder.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${moduleNameCapitalized} } from '../../../${moduleNamePlural}/entities/${moduleName}.entity';
import { ${moduleNamePluralCapitalized}SeederService } from './${moduleName}s-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([${moduleNameCapitalized}])],
  providers: [${moduleNamePluralCapitalized}SeederService],
  exports: [${moduleNamePluralCapitalized}SeederService],
})
export class ${moduleNamePluralCapitalized}SeederModule {}`;

// Crear el contenido del servicio seeder
const serviceContent = `// src/database/seeders/${moduleNamePlural}/${moduleName}s-seeder.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${moduleNameCapitalized} } from '../../../${moduleNamePlural}/entities/${moduleName}.entity';
import { Seeder } from '../interfaces/seeder.interface';

@Injectable()
export class ${moduleNamePluralCapitalized}SeederService implements Seeder {
  private readonly logger = new Logger(${moduleNamePluralCapitalized}SeederService.name);

  constructor(
    @InjectRepository(${moduleNameCapitalized})
    private readonly ${moduleName}Repository: Repository<${moduleNameCapitalized}>,
  ) {}

  async seed() {
    this.logger.log('Iniciando seeding de ${moduleNamePlural}');
    
    // Verificar si ya existen ${moduleNamePlural}
    const count = await this.${moduleName}Repository.count();
    if (count > 0) {
      this.logger.log(\`La base de datos ya contiene \${count} ${moduleNamePlural}. Saltando seeding.\`);
      return;
    }

    // Definir datos iniciales
    const ${moduleNamePlural} = [
      // Añade aquí tus datos iniciales
    ];

    try {
      // Guardar en la base de datos
      const created${moduleNamePluralCapitalized} = await Promise.all(
        ${moduleNamePlural}.map(async (item) => {
          const new${moduleNameCapitalized} = this.${moduleName}Repository.create(item);
          return await this.${moduleName}Repository.save(new${moduleNameCapitalized});
        }),
      );

      this.logger.log(\`Se crearon \${created${moduleNamePluralCapitalized}.length} ${moduleNamePlural} correctamente\`);
      return created${moduleNamePluralCapitalized};
    } catch (error) {
      this.logger.error(\`Error al crear ${moduleNamePlural} iniciales\`);
      throw error;
    }
  }
}`;

// Escribir los archivos
fs.writeFileSync(
  path.join(moduleDir, `${moduleName}s-seeder.module.ts`),
  moduleContent
);

fs.writeFileSync(
  path.join(moduleDir, `${moduleName}s-seeder.service.ts`),
  serviceContent
);

console.log(`✅ Se han creado los archivos para el seeder de ${moduleNamePluralCapitalized}:`);
console.log(`   - src/database/seeders/${moduleNamePlural}/${moduleName}s-seeder.module.ts`);
console.log(`   - src/database/seeders/${moduleNamePlural}/${moduleName}s-seeder.service.ts`);
console.log(`\nNo olvides añadir ${moduleNamePluralCapitalized}SeederModule a los imports en seeder.module.ts`);
console.log(`y ${moduleNamePluralCapitalized}SeederService al constructor de SeederService.`);