# Guía para Seeders - Rugby League Manager

Este documento explica cómo crear y utilizar seeders en el proyecto Rugby League Manager para poblar la base de datos con datos iniciales.

## 📋 Índice

1. [Introducción a los Seeders](#introducción-a-los-seeders)
2. [Estructura del Sistema de Seeders](#estructura-del-sistema-de-seeders)
3. [Ejecutar los Seeders Existentes](#ejecutar-los-seeders-existentes)
4. [Crear Nuevos Seeders](#crear-nuevos-seeders)
   - [Usando el Script Generador](#usando-el-script-generador)
   - [Registrar el Nuevo Seeder](#registrar-el-nuevo-seeder)
   - [Implementar la Lógica del Seeder](#implementar-la-lógica-del-seeder)
5. [Buenas Prácticas](#buenas-prácticas)
6. [Resolución de Problemas Comunes](#resolución-de-problemas-comunes)

## Introducción a los Seeders

Los seeders son scripts diseñados para poblar la base de datos con datos iniciales, lo que es especialmente útil durante el desarrollo, pruebas, y para proporcionar un estado inicial consistente de la aplicación.

En Rugby League Manager, los seeders están implementados de forma modular, donde cada módulo de la aplicación (Users, Leagues, etc.) tiene sus propios seeders independientes.

## Estructura del Sistema de Seeders

```
src/
└── database/
    └── seeders/
        ├── interfaces/              # Interfaces genéricas para seeders
        │   └── seeder.interface.ts  # Define la interfaz Seeder
        ├── users/                   # Seeders para el módulo de usuarios
        │   ├── users-seeder.module.ts
        │   └── users-seeder.service.ts
        ├── leagues/                 # Seeders para el módulo de ligas
        │   ├── leagues-seeder.module.ts
        │   └── leagues-seeder.service.ts
        ├── seeder.module.ts         # Módulo principal que coordina todos los seeders
        ├── seeder.service.ts        # Servicio principal para ejecutar seeders
        └── run-seeders.ts           # Script para ejecutar todos los seeders
```

## Ejecutar los Seeders Existentes

Para ejecutar todos los seeders y poblar la base de datos con datos iniciales:

```bash
npm run seed
```

Este comando ejecutará el script `run-seeders.ts`, que a su vez llamará al método `seed()` del `SeederService`. El servicio ejecutará secuencialmente todos los seeders registrados en el orden adecuado.

## Crear Nuevos Seeders

### Usando el Script Generador

Para crear un nuevo seeder para un módulo, utilizamos el script generador:

```bash
npm run create:seeder -- nombre-modulo
```

Por ejemplo, para crear un seeder para un módulo "team":

```bash
npm run create:seeder -- team
```

Esto generará:

- `src/database/seeders/teams/teams-seeder.module.ts`
- `src/database/seeders/teams/teams-seeder.service.ts`

> **Nota**: El script asume que tu entidad está ubicada en `src/teams/entities/team.entity.ts`. Ajusta las rutas importadas si es necesario.

### Registrar el Nuevo Seeder

Después de crear los archivos del seeder, necesitas registrarlos en el sistema principal:

1. **Importar el módulo** en `src/database/seeders/seeder.module.ts`:

```typescript
import { TeamsSeederModule } from './teams/teams-seeder.module';

@Module({
  imports: [
    // Otros módulos...
    UsersSeederModule,
    LeaguesSeederModule,
    TeamsSeederModule, // Añadir el nuevo módulo aquí
  ],
  providers: [SeederService],
})
export class SeederModule {}
```

2. **Inyectar el servicio** en `src/database/seeders/seeder.service.ts`:

```typescript
import { TeamsSeederService } from './teams/teams-seeder.service';

@Injectable()
export class SeederService {
  constructor(
    private readonly usersSeederService: UsersSeederService,
    private readonly leaguesSeederService: LeaguesSeederService,
    private readonly teamsSeederService: TeamsSeederService, // Inyectar el nuevo servicio
  ) {}

  async seed() {
    try {
      this.logger.log('Iniciando proceso de seeding...');
      
      // Ejecutar los seeders en el orden correcto
      await this.usersSeederService.seed();
      await this.leaguesSeederService.seed();
      await this.teamsSeederService.seed(); // Añadir la llamada al nuevo seeder
      
      this.logger.log('Proceso de seeding completado exitosamente');
    } catch (error) {
      this.logger.error('Error durante el proceso de seeding');
      this.logger.error(error);
    }
  }
}
```

### Implementar la Lógica del Seeder

El script generador habrá creado un servicio seeder con una estructura básica. Ahora necesitas personalizarlo con tus datos:

1. **Definir los datos iniciales** en el archivo `teams-seeder.service.ts`:

```typescript
// Definir datos iniciales
const teams = [
  {
    name: 'Barcelona Rugby Club',
    foundedYear: 1982,
    leagueId: 1, // Asegúrate de que este ID existe
    // Otras propiedades según tu entidad Team
  },
  {
    name: 'Madrid Lions',
    foundedYear: 1989,
    leagueId: 1,
  },
  // Más equipos...
];
```

2. **Manejar dependencias** si el seeder depende de otras entidades:

```typescript
// Si el Team depende de League, importa y obtén la referencia
@InjectRepository(League)
private readonly leagueRepository: Repository<League>,

// En el método seed()
const superRugbyLeague = await this.leagueRepository.findOneBy({ name: 'Super Rugby' });
if (!superRugbyLeague) {
  this.logger.warn('No se encontró la liga Super Rugby. Saltando seeding de equipos.');
  return;
}

// Usar la referencia en los datos
const teams = [
  {
    name: 'Barcelona Rugby Club',
    league: superRugbyLeague,
    // Otras propiedades
  },
  // Más equipos...
];
```

## Buenas Prácticas

1. **Ordenar los seeders correctamente**: Ejecuta primero los seeders de entidades independientes y luego los que dependen de otras entidades.

2. **Verificar existencia**: Siempre verifica si ya existen datos antes de insertar nuevos para evitar duplicados:

```typescript
const count = await this.teamRepository.count();
if (count > 0) {
  this.logger.log(`La base de datos ya contiene ${count} equipos. Saltando seeding.`);
  return;
}
```

3. **Gestionar errores**: Usa try/catch y logging adecuado para facilitar la depuración:

```typescript
try {
  // Operaciones con la base de datos
} catch (error) {
  this.logger.error('Error al crear equipos iniciales');
  this.logger.error(error);
  throw error;
}
```

4. **Usar la fábrica de datos**: Para datos más complejos o aleatorios, utiliza la clase `DataFactory`:

```typescript
import { DataFactory } from '../../factories/data-factory';

// En el método seed()
const randomTeam = DataFactory.createTeamData({
  name: 'Custom Team Name', // Sobrescribir valores específicos
});
```

## Resolución de Problemas Comunes

### Errores de Tipado

Si encuentras errores de tipado como "Type X is not assignable to Type Y", verifica:

1. **Importación correcta de tipos**: Asegúrate de importar todos los tipos necesarios.

2. **Casting de tipos**: Usa `as` para forzar un tipo cuando sea necesario:

```typescript
role: 'admin' as UserRole,
```

3. **DeepPartial**: TypeORM usa `DeepPartial<Entity>` para la creación, asegúrate de que tus objetos cumplan con esta estructura.

### Errores de Dependencias Circulares

Si encuentras errores de dependencia circular:

1. **Separar módulos**: Asegúrate de que tus módulos no se importen mutuamente.

2. **forwardRef**: En casos extremos, utiliza `forwardRef()` de NestJS para resolver dependencias circulares.

### Errores de Base de Datos

1. **Valores únicos**: Si una columna tiene restricción de unicidad, asegúrate de no insertar duplicados.

2. **Foreign Keys**: Verifica que las entidades relacionadas existan antes de intentar crear una referencia.

---

Con esta guía, deberías ser capaz de utilizar eficientemente el sistema de seeders para mantener tu base de datos con datos consistentes para desarrollo y pruebas.

Si necesitas más ayuda con casos específicos, consulta los ejemplos en los seeders existentes para `users` y `leagues`.
