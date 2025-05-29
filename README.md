# Rugby League Manager - Backend API

**Rugby League Manager** es una API desarrollada en [NestJS](https://nestjs.com).

Este backend gestiona la lógica y datos de una plataforma para administrar ligas de rugby. Aplica principios de arquitectura modular, pruebas automatizadas y estándares de producción.

---

## 🧱 Características actuales

🔐 **Autenticación JWT segura**  
🎭 **Control de acceso por roles** (admin, user)  
📄 **CRUD completo** para Leagues, Teams y Players  
✅ **Validaciones de entrada** con class-validator  
🧠 **Paginación, filtros y búsqueda** por nombre y país  
📦 **Soft delete y restauración** lógica  
👤 **Auditoría completa** (createdBy, updatedBy, deletedBy)  
📊 **Documentación automática** con Swagger  
♻️ **Servicio de paginación genérico** (PaginationService)  
🧪 **Tests unitarios** en controladores y servicios con Jest  
🧱 **Estructura modular y escalable** para futuros módulos  
🛡️ **Protección Throttle** contra ataques de fuerza bruta  
🔒 **Configuración de seguridad** con Helmet  
⚡ **Compresión de respuestas** para mejor performance  
🌐 **CORS configurado** para desarrollo y producción  
🚀 **Configuración optimizada** para deployment

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
```

---

## 🚀 Setup del proyecto

### 📦 Instalación de dependencias

```bash
npm install
```

### 🔧 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
DATABASE_URL="tu_conexion_a_base_de_datos"
JWT_SECRET="tu_jwt_secret_aqui"
```

### ▶️ Correr en entorno de desarrollo

```bash
npm run start:dev
```

### ▶️ Correr pruebas

```bash
npm run test
```

---

## 🔐 Autenticación

La autenticación se realiza con JWT. Los endpoints protegidos requieren incluir un token con formato:

```bash
Authorization: Bearer <access_token>
```

### Endpoints de autenticación

- `POST /api/v1/auth/register` – Registro de usuario
- `POST /api/v1/auth/login` – Login con email y password (retorna JWT)

---

## 📘 Swagger

La documentación generada en tiempo real se encuentra en:

```bash
http://localhost:3000/api/docs
```

### 🔑 Cómo usar la autenticación en Swagger

1. **Haz clic en el botón "Authorize" 🔒** en la esquina superior derecha
2. **Ingresa tu JWT token** (sin la palabra "Bearer")
3. **Haz clic en "Authorize"**
4. Ahora puedes probar los endpoints protegidos

> La documentación incluye todas las rutas públicas y protegidas, con esquemas de DTOs, status y ejemplos.

---

## 📚 Endpoints actuales

> **Nota**: Todas las rutas tienen el prefijo `/api/v1/`

### `/leagues` (Ligas de Rugby)

| Método | Ruta                      | Rol requerido | Descripción                    |
|--------|---------------------------|---------------|--------------------------------|
| GET    | `/api/v1/leagues`         | Público       | Listar todas las ligas         |
| GET    | `/api/v1/leagues/:id`     | Público       | Obtener liga por ID            |
| POST   | `/api/v1/leagues`         | `admin`       | Crear nueva liga               |
| PATCH  | `/api/v1/leagues/:id`     | `admin`       | Actualizar liga existente      |
| DELETE | `/api/v1/leagues/:id`     | `admin`       | Eliminar liga (soft delete)    |

### `/teams` (Equipos de Rugby)

| Método | Ruta                      | Rol requerido | Descripción                    |
|--------|---------------------------|---------------|--------------------------------|
| GET    | `/api/v1/teams`           | Público       | Listar todos los equipos       |
| GET    | `/api/v1/teams/:id`       | Público       | Obtener equipo por ID          |
| POST   | `/api/v1/teams`           | `admin`       | Crear nuevo equipo             |
| PATCH  | `/api/v1/teams/:id`       | `admin`       | Actualizar equipo existente    |
| DELETE | `/api/v1/teams/:id`       | `admin`       | Eliminar equipo (soft delete)  |

### `/players` (Jugadores de Rugby)

| Método | Ruta                      | Rol requerido | Descripción                    |
|--------|---------------------------|---------------|--------------------------------|
| GET    | `/api/v1/players`         | Público       | Listar todos los jugadores     |
| GET    | `/api/v1/players/:id`     | Público       | Obtener jugador por ID         |
| POST   | `/api/v1/players`         | `admin`       | Crear nuevo jugador            |
| PATCH  | `/api/v1/players/:id`     | `admin`       | Actualizar jugador existente   |
| DELETE | `/api/v1/players/:id`     | `admin`       | Eliminar jugador (soft delete) |

### 🔒 Protecciones implementadas

- **Throttle global**: Protección contra ataques de fuerza bruta
- **Roles de usuario**: Control granular de permisos
- **JWT Authentication**: Tokens seguros para autenticación
- **Validación de datos**: Validación automática de DTOs
- **Helmet**: Protección contra vulnerabilidades comunes

---

## 🧪 Testing

Este proyecto incluye cobertura de pruebas:

- ✅ **Unit tests** de `Services` y `Controllers`
- 🧪 Ejecutados con `Jest` y `@nestjs/testing`
- ✅ Mocks de dependencias correctamente configurados
- ✅ Todos los tests actuales pasan exitosamente

### Comandos de testing

```bash
# Ejecutar todos los tests
npm run test

# Tests en modo watch
npm run test:watch

# Cobertura de tests
npm run test:cov
```

> Tests E2E planificados para próximas fases.

---

## 🏗️ Configuración de producción

### Características incluidas

- **Compresión gzip** para respuestas HTTP
- **Helmet** para headers de seguridad
- **CORS** configurado según el entorno
- **Validaciones estrictas** con transformación automática
- **Logs estructurados** con información del entorno
- **Swagger deshabilitado** en producción

### Variables de entorno para producción

```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
DATABASE_URL="tu_url_de_produccion"
JWT_SECRET="jwt_secret_seguro_para_produccion"
```

---

## 🛠️ Roadmap en desarrollo

- [ ] Implementación de entidades para métricas de players
- [ ] Carga inicial de datos (seeders) para players y teams
- [ ] Roles dinámicos desde BD
- [ ] Tests E2E completos
- [ ] Refresh tokens
- [ ] Sistema de notificaciones por email

---

## 👨‍💻 Autor

**Camilo Lavado**  
Desarrollador Fullstack · Psicólogo · Autodidacta 🧩  
🔗 [GitHub](https://github.com/camilo-lavado)

---

## 📄 Licencia

Distribuido bajo la licencia [MIT](LICENSE).

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
