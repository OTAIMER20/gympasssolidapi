# 🏋️‍♂️ GymPass API

A robust and scalable backend API that simulates the GymPass platform, built with modern Node.js technologies and following SOLID principles for maintainable and extensible code.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.5-orange.svg)](https://fastify.io/)
[![Prisma](https://img.shields.io/badge/Prisma-6.14-purple.svg)](https://www.prisma.io/)
[![SOLID](https://img.shields.io/badge/Architecture-SOLID-red.svg)](https://en.wikipedia.org/wiki/SOLID)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

GymPass API is a comprehensive fitness platform backend that provides:

- **User Management**: Registration, authentication, and role-based access control
- **Gym Management**: Create, search, and discover nearby gyms with geolocation
- **Check-in System**: Location-based gym check-ins with validation rules
- **Real-time Metrics**: User activity tracking and performance analytics
- **Geolocation Services**: Distance calculations and proximity-based features

The project demonstrates advanced software engineering practices including SOLID principles, clean architecture, comprehensive testing, and modern development workflows.

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (ADMIN/MEMBER)
- Secure password hashing with bcrypt
- Cookie-based token management

### 🏢 Gym Management
- Create and manage gym locations
- Geolocation-based gym discovery
- Search functionality with filtering
- Proximity-based gym recommendations

### 📍 Check-in System
- Location-verified gym check-ins
- Distance validation (100m radius)
- Daily check-in limits
- Check-in history and metrics

### 📊 Analytics & Reporting
- User check-in statistics
- Performance metrics
- Historical data tracking
- Paginated data responses

### 🧪 Quality Assurance
- Comprehensive unit and integration tests
- Test coverage reporting
- In-memory repositories for testing
- Automated test workflows

## 🏗️ Architecture

This project follows **SOLID principles** and **Clean Architecture** patterns:

### SOLID Principles Implementation

- **S**ingle Responsibility: Each service handles one specific business logic
- **O**pen/Closed: Services are extensible without modification
- **L**iskov Substitution: Repository interfaces allow different implementations
- **I**nterface Segregation: Focused interfaces for specific use cases
- **D**ependency Inversion: High-level modules depend on abstractions

### Architecture Layers

```
┌─────────────────────────────────────┐
│           HTTP Controllers          │ ← Request/Response handling
├─────────────────────────────────────┤
│           Middleware Layer          │ ← Authentication & validation
├─────────────────────────────────────┤
│            Service Layer            │ ← Business logic & rules
├─────────────────────────────────────┤
│         Repository Layer            │ ← Data access abstraction
├─────────────────────────────────────┤
│           Database Layer            │ ← PostgreSQL with Prisma
└─────────────────────────────────────┘
```

### Design Patterns

- **Repository Pattern**: Abstract data access layer
- **Factory Pattern**: Service instantiation with dependencies
- **Strategy Pattern**: Different repository implementations
- **Dependency Injection**: Constructor-based dependency management

## 🛠️ Tech Stack

### Core Technologies
- **Node.js** - Runtime environment
- **TypeScript** - Type-safe JavaScript
- **Fastify** - High-performance web framework
- **Prisma** - Modern database ORM

### Database
- **PostgreSQL** - Primary database
- **Prisma Client** - Type-safe database client
- **Prisma Migrate** - Database schema management

### Authentication & Security
- **JWT** - JSON Web Tokens
- **bcryptjs** - Password hashing
- **@fastify/jwt** - JWT integration
- **@fastify/cookie** - Cookie management

### Validation & Documentation
- **Zod** - Schema validation
- **Swagger/OpenAPI** - API documentation
- **Swagger UI** - Interactive API explorer

### Testing
- **Vitest** - Fast unit testing framework
- **Supertest** - HTTP testing
- **Coverage** - Test coverage reporting

### Development Tools
- **tsx** - TypeScript execution
- **tsup** - TypeScript bundling
- **Docker** - Containerization

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/OTAIMER20/gympasssolidapi.git
   cd gympasssolidapi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start PostgreSQL with Docker**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3333`

### Environment Variables

```env
NODE_ENV=dev
JWT_SECRET=your-secret-key
PORT=3333
DATABASE_URL=postgresql://docker:docker@localhost:5433/apisolid
```

## 📚 API Documentation

### Interactive Documentation

Visit `http://localhost:3333/docs` for the interactive Swagger UI documentation.

### API Endpoints

#### Authentication
- `POST /users/register` - User registration
- `POST /users/authenticate` - User login
- `POST /users/refresh` - Refresh JWT token

#### Users
- `GET /users/profile` - Get user profile
- `GET /users/metrics` - Get user check-in metrics

#### Gyms
- `POST /gyms` - Create new gym (Admin only)
- `GET /gyms/search` - Search gyms by query
- `GET /gyms/nearby` - Find nearby gyms by coordinates

#### Check-ins
- `POST /check-ins` - Create gym check-in
- `GET /check-ins/history` - Get user check-in history
- `PATCH /check-ins/:id/validate` - Validate check-in (Admin only)

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🗄️ Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    User {
        uuid id PK
        string name
        string email UK
        string password_hash
        enum role
        datetime created_at
    }
    
    Gym {
        uuid id PK
        string title
        string description
        string phone
        decimal latitude
        decimal longitude
    }
    
    Chekin {
        uuid id PK
        datetime created_at
        datetime validated_at
        uuid user_id FK
        uuid gym_id FK
    }
    
    User ||--o{ Chekin : "performs"
    Gym ||--o{ Chekin : "receives"
```

### Database Flow

```mermaid
flowchart TD
    A[Client Request] --> B[Fastify Router]
    B --> C[JWT Middleware]
    C --> D[Controller]
    D --> E[Service Layer]
    E --> F[Repository Interface]
    F --> G[Prisma Repository]
    G --> H[PostgreSQL Database]
    H --> G
    G --> F
    F --> E
    E --> D
    D --> C
    C --> B
    B --> I[Client Response]
```

## 🧪 Testing

### Running Tests

```bash
# Unit tests (services)
npm test

# Integration tests (HTTP controllers)
npm run test:e2e

# Test coverage
npm run test:coverage

# Watch mode
npm run test:watch

# UI mode
npm run test:ui
```

### Test Structure

- **Unit Tests**: Service layer business logic
- **Integration Tests**: HTTP endpoints and database operations
- **Repository Tests**: Data access layer with in-memory implementations
- **Coverage**: Comprehensive test coverage reporting

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t gympass-api .

# Run container
docker run -p 3333:3333 gympass-api
```

### Environment Considerations

- Set `NODE_ENV=prod`
- Use strong `JWT_SECRET`
- Configure production database
- Set up reverse proxy (nginx)
- Enable HTTPS
- Configure logging and monitoring

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow SOLID principles
- Write comprehensive tests
- Use TypeScript strict mode
- Follow the existing code style
- Update documentation as needed

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Paulo Junior [OTAIMER]**

- GitHub: [@OTAIMER20](https://github.com/OTAIMER20)
- Project: [GymPass API](https://github.com/OTAIMER20/gympasssolidapi)

## 🙏 Acknowledgments

- [Rocketseat](https://rocketseat.com.br/) - Educational platform
- [Fastify](https://fastify.io/) - High-performance web framework
- [Prisma](https://www.prisma.io/) - Modern database toolkit
- [Vitest](https://vitest.dev/) - Fast unit testing framework

---

⭐ **Star this repository if you found it helpful!**
