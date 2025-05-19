# Rugby League Manager - Backend API

**Rugby League Manager** es una API desarrollada en [NestJS](https://nestjs.com).

Este backend gestiona la lógica y datos de una plataforma para administrar ligas de rugby. Aplica principios de arquitectura modular, pruebas automatizadas y estándares de producción.

---

## 🧱 Características actuales

🔐 Autenticación JWT segura
🎭 Control de acceso por roles (admin, user)
📄 CRUD completo para Leagues
📄 CRUD completo para Teams
📄 CRUD completo para Players
✅ Validaciones de entrada con class-validator
🧠 Paginación, filtros y búsqueda por nombre y país
📦 Soft delete y restauración lógica
👤 Auditoría (createdBy, updatedBy, deletedBy)
📊 Documentación automática con Swagger
♻️ Servicio de paginación genérico (PaginationService)
🧪 Tests unitarios en controladores y servicios con Jest
🧱 Estructura modular y escalable para futuros módulos (Teams, Players, etc.)
🧱 Implementación de Throttle para protección contra ataques de fuerza bruta.
✨ Swagger configurado para throttle.
✨ Implementación de throttle.
🧱 Modelo entidad-relación inicial.
🛠️ Corrección para excluir datos sensibles en la respuesta.

---

## 💡 Próximas características

- ✅ E2E tests con login y autorización
- ✅ Seeder para datos iniciales
- 🔄 Soporte para Refresh Tokens
- 📧 Envío de correos al registrar usuario
- 🌍 Internacionalización de mensajes

---

## 🧩 Diagrama Entidad-Relación (ERD)

El modelo de datos ha sido diseñado para cumplir con las tres formas normales de normalización.

Puedes visualizar o editar el diagrama en [dbdiagram.io](https://dbdiagram.io) utilizando el archivo:

📄 [`docs/schema.dbml`](./docs/database/schema.dbml)

Esto permite mantener sincronizado el diseño lógico con la implementación en código.

---

## 📁 Estructura del proyecto

```bash
src/
├── auth/              # Autenticación, JWT y guards
├── users/             # Gestión de usuarios y roles
├── leagues/           # Ligas de rugby (CRUD + seguridad)
├── players/           # Jugadores de rugby (CRUD + seguridad)
├── teams/             # Equipos de rugby (CRUD + seguridad)
├── common/            # Servicios reutilizables (ej: paginación)
└── main.ts            # Bootstrap principal de NestJS
```bash

---

## 🚀 Setup del proyecto

### 📦 Instalación de dependencias

```bash
npm install
```bash

### ▶️ Correr en entorno de desarrollo

```bash
npm run start:dev
```

---

### ▶️ Correr pruebas entorno de desarrollo

```bash
npm run test
```

---

## 🔐 Autenticación

La autenticación se realiza con JWT. Los endpoints protegidos requieren incluir un token con formato:

```bash
Authorization: Bearer <access_token>
```

### Endpoints disponibles

- `POST /auth/register` – Registro de usuario
- `POST /auth/login` – Login con email y password (retorna JWT)

---

## 📘 Swagger

La documentación generada en tiempo real se encuentra en:

```bash
http://localhost:3000/api
```

Incluye todas las rutas públicas y protegidas, con esquemas de DTOs, status y ejemplos.

---

## 📚 Endpoints actuales

### `/leagues` (Ligas de Rugby)

| Método | Ruta                 | Rol requerido |
|--------|----------------------|---------------|
| GET    | `/test/throttle`     | Público       |
| GET    | `/leagues`           | Público       |
| GET    | `/leagues/:id`       | Público       |
| POST   | `/leagues`           | `admin`       |
| PATCH    | `/leagues/:id`       | `admin`       |
| DELETE | `/leagues/:id`       | `admin`       |

> Las rutas de escritura (`POST`, `PATCH`, `DELETE`) están protegidas con `@Roles('admin')` y `@UseGuards(JwtAuthGuard, RolesGuard)`.
> Las Rutas estan protegidas de forma global por throttle.
---

### `/teams` (Equipos de Rugby)

| Método | Ruta                 | Rol requerido |
|--------|----------------------|---------------|
| GET    | `/test/throttle`     | Público       |
| GET    | `/teams`           | Público       |
| GET    | `/teams/:id`       | Público       |
| POST   | `/teams`           | `admin`       |
| PATCH    | `/teams/:id`       | `admin`       |
| DELETE | `/teams/:id`       | `admin`       |

> Las rutas de escritura (`POST`, `PATCH`, `DELETE`) están protegidas con `@Roles('admin')` y `@UseGuards(JwtAuthGuard, RolesGuard)`.
> Las Rutas estan protegidas de forma global por throttle.
---

### `/players` (Jugadores de Rugby)

| Método | Ruta                 | Rol requerido |
|--------|----------------------|---------------|
| GET    | `/test/throttle`     | Público       |
| GET    | `/players`           | Público       |
| GET    | `/players/:id`       | Público       |
| POST   | `/players`           | `admin`       |
| PATCH    | `/players/:id`       | `admin`       |
| DELETE | `/players/:id`       | `admin`       |

> Las rutas de escritura (`POST`, `PATCH`, `DELETE`) están protegidas con `@Roles('admin')` y `@UseGuards(JwtAuthGuard, RolesGuard)`.
> Las Rutas estan protegidas de forma global por throttle.

## 🧪 Testing

Este proyecto incluye cobertura de pruebas:

- ✅ **Unit tests** de `Services` y `Controllers`
- 🧪 Ejecutados con `Jest` y `@nestjs/testing`
- ✅ Mocks de dependencias correctamente configurados
- ✅ Todos los tests actuales pasan exitosamente

### Comando

```bash
npm run test
```

> Tests E2E planificados para próximas fases.

---

## 🛠️ Roadmap en desarrollo

- [ ] Implementación de entidades para metricas de players
- [ ] Carga inicial de datos (seeders)(players, teams)
- [ ] Roles dinámicos desde BD

---

## 👨‍💻 Autor

**Camilo Lavado**  
Desarrollador Fullstack · Psicólogo · Autodidacta 🧩  
🔗 [GitHub](https://github.com/camilo-lavado)

---

## 📄 Licencia

Distribuido bajo la licencia [MIT](LICENSE).
