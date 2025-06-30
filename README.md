# Rugby League Manager - Backend API

**Rugby League Manager** es una API profesional desarrollada con [NestJS](https://nestjs.com) + PostgreSQL, diseñada para administrar ligas, equipos, jugadores y partidos de rugby en Chile y Latinoamérica.

Aplica principios de arquitectura modular, seguridad robusta, pruebas automatizadas y escalabilidad real.

---

## 🧱 Características actuales

🔐 **Autenticación JWT segura**  
🎭 **Control de acceso por roles** (admin, user)  
📄 **CRUD completo** para entidades clave del sistema  
🧠 **Paginación, filtros y búsqueda** en todos los endpoints  
✅ **Validaciones estrictas** en DTOs con class-validator  
📦 **Soft delete** y campos de auditoría (createdBy, updatedBy, etc.)  
🔎 **Búsqueda por texto y filtros por campos numéricos**  
🧪 **Tests unitarios** en servicios y controladores con Jest  
🧱 **Estructura modular y reutilizable**  
📊 **Swagger automático** y actualizado dinámicamente  
🛡️ **Throttle + Helmet + CORS** para máxima seguridad  
♻️ **Servicio genérico de paginación** (`PaginationService`)  
🧰 **BaseCrudService\`T\`** para crear servicios DRY y mantenibles

---

## 📦 Entidades implementadas

| Entidad               | Descripción                                            |
| --------------------- | ------------------------------------------------------ |
| `auth`                | Registro, login y generación de JWT                    |
| `users`               | Gestión de usuarios y perfiles                         |
| `roles`               | Control de roles por nombre (`admin`, `user`, etc.)    |
| `permissions`         | Permisos (base para control futuro)                    |
| `leagues`             | Ligas de rugby                                         |
| `categories`          | Categorías regionales o temáticas                      |
| `teams`               | Equipos de rugby                                       |
| `players`             | Jugadores vinculados a usuarios y equipos              |
| `positions`           | Posiciones en cancha (ej: wing, hooker, fullback...)   |
| `position_types`      | Tipos de posición (ataque, defensa)                    |
| `stadiums`            | Estadios de juego                                      |
| `seasons`             | Temporadas deportivas                                  |
| `divisions`           | Divisiones internas dentro de una liga                 |
| `standings`           | Tabla de posiciones con puntos, tries, recibidos, etc. |
| `fixtures`            | Calendario de partidos (fixtures)                      |
| `match_teams`         | Relación fixture ↔ equipo (local/visitante)           |
| `match_participation` | Participación de jugadores en partidos                 |
| `scores`              | Puntajes de equipos en partidos                        |
| `match_stats`         | Estadísticas de partidos (posesión, tackles, etc.)     |
| `player_caps`         | Historial de partidos jugados por jugador              |
| `player_season_stats` | Estadísticas de jugadores por temporada                |
| `match_aggregates`    | Totales agregados de estadísticas por partido          |

---

## 📘 Swagger

La documentación en tiempo real está disponible en:

```bash
http://localhost:3000/api/docs
```

### 🔑 Autenticación en Swagger

1. Haz clic en "Authorize"
2. Ingresa tu JWT **sin** el prefijo `Bearer`
3. Ya puedes probar endpoints protegidos

---

## 🚀 Setup del proyecto

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/rugby-league-manager-Backend.git
cd rugby-league-manager-Backend
```

### 2. Instala dependencias

```bash
npm install
```

### 3. Variables de entorno

Crea un archivo `.env`:

```env
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
DATABASE_URL=postgres://user:pass@localhost:5432/rugby_db
JWT_SECRET=super_jwt_secret
```

### 4. Corre la app en modo desarrollo

```bash
npm run start:dev
```

---

## 🧩 Diagrama Entidad-Relación (ERD)

El diseño de base de datos cumple con buenas prácticas de normalización.

Puedes ver el diagrama completo en [`docs/schema.dbml`](./docs/database/schema.dbml)

---

## 🧪 Testing

Este proyecto incluye:

- ✅ Unit tests con mocks en services y controllers
- 🧪 Jest configurado con cobertura
- ✅ DTOs validados automáticamente

```bash
npm run test         # Ejecuta todos los tests
npm run test:watch   # Corre tests en modo observación
npm run test:cov     # Cobertura
```

---

## 🔒 Seguridad

- ✅ JWT con expiración de 24h
- ✅ Roles y protección por `@Roles()` + `RolesGuard`
- ✅ `@CurrentUser()` decorador global
- ✅ Throttling por IP con `@Throttle()`
- ✅ Headers seguros (`helmet`)
- ✅ CORS separado por entorno

---

## 🔄 Convenciones adoptadas

- DTOs segmentados: `create-*.dto.ts`, `update-*.dto.ts`, `query-*.dto.ts`
- DTOs de query sin `@IsNumberString()` para evitar errores comunes
- Validaciones consistentes en todos los `QueryDto`
- Archivos organizados por módulo
- Todas las respuestas están paginadas cuando aplica
- Respuestas estructuradas con `{ message, data, meta? }`

---

## 🛠️ Roadmap en desarrollo

- [ ] Seeders de datos iniciales (`leagues`, `players`, `positions`)
- [ ] Emails automáticos en registro
- [ ] Refresh tokens y logout seguro
- [ ] Soporte para inscripciones de jugadores vía frontend
- [ ] Notificaciones y recordatorios
- [ ] Tests E2E

---

## 👨‍💻 Autor

**Camilo Lavado**  
Desarrollador Backend · Apasionado por el rugby y la calidad de código  
🔗 [GitHub](https://github.com/camilo-lavado)

---

## 📄 Licencia

MIT
