# Rugby League Manager - Backend API

**Rugby League Manager** es una API desarrollada en [NestJS](https://nestjs.com) que sirve como backend para una plataforma de gestión de ligas de rugby. Este proyecto es parte de un portafolio profesional y ha sido diseñado siguiendo estándares reales de desarrollo backend.

---

## 🧱 Características actuales

- 🔐 Autenticación con JWT
- 🎭 Control de acceso por roles (`admin`, `user`)
- 📄 CRUD completo para Ligas (`Leagues`)
- ✅ Validaciones con `class-validator`
- 🧠 Paginación, filtros y búsqueda por nombre/país
- 📦 Soft delete y restauración
- 👤 Auditoría (`createdBy`, `updatedBy`, `deletedBy`)
- 📊 Documentación automática con Swagger
- 🧩 Servicio de paginación reutilizable (`PaginationService`)
- 🧪 Estructura modular y lista para escalar (`Teams`, `Players`, etc.)

---

## 📁 Estructura del proyecto

```bash
src/
├── auth/              # Autenticación y estrategia JWT
├── users/             # Usuarios con roles
├── leagues/           # Módulo de gestión de ligas
├── common/            # Servicios reutilizables (paginación)
└── main.ts            # Bootstrap principal
```

---

## 🚀 Setup del proyecto

### 📦 Instalación

```bash
npm install
```

### ▶️ Correr en desarrollo

```bash
npm run start:dev
```

---

## 🔐 Autenticación

Se utiliza JWT en combinación con guards y roles para proteger rutas:

- `POST /auth/register` – Crea usuarios (requiere `role`)
- `POST /auth/login` – Devuelve el `access_token`
- Usar `Bearer token` en Swagger o Postman

---

## 📘 Documentación Swagger

Accede a la documentación en tiempo real:

```
http://localhost:3000/api
```

---

## 📚 Rutas disponibles hasta ahora

### `/leagues`

| Método | Ruta             | Rol requerido |
|--------|------------------|---------------|
| GET    | `/leagues`       | Público       |
| GET    | `/leagues/:id`   | Público       |
| POST   | `/leagues`       | `admin`       |
| PUT    | `/leagues/:id`   | `admin`       |
| DELETE | `/leagues/:id`   | `admin`       |

Todas las rutas `POST`, `PUT`, `DELETE` están protegidas con `@Roles('admin')` y `@UseGuards(JwtAuthGuard, RolesGuard)`.

---

## 🛠️ En desarrollo

Actualmente se encuentra en desarrollo la siguiente etapa:

- Módulo `teams`
- Relaciones entre ligas y equipos
- Reutilización de paginación y control de auditoría

---

## 🧠 Autor

**Camilo Lavado**  
Desarrollador Fullstack · Psicólogo de formación · Autodidacta 🧩  
[GitHub](https://github.com/camilo-lavado)

---

## 📄 Licencia

Proyecto open-source bajo licencia [MIT](LICENSE).

```

---
