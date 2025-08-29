import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { checkinsRoutes } from './http/controllers/checkins/routes'

export const app = fastify()

// Register Swagger (OpenAPI) documentation
app.register(swagger, {
  openapi: {
    info: {
      title: 'Fitness API',
      description: 'A comprehensive API for managing gyms, users, and check-ins with location-based services',
      version: '1.0.0',
      contact: {
        name: 'API Support',
        email: 'support@fitnessapi.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'Unique user identifier' },
            name: { type: 'string', description: 'User full name' },
            email: { type: 'string', format: 'email', description: 'User email address' },
            role: { type: 'string', enum: ['ADMIN', 'MEMBER'], description: 'User role in the system' },
            created_at: { type: 'string', format: 'date-time', description: 'User creation timestamp' }
          },
          required: ['id', 'name', 'email', 'role', 'created_at']
        },
        UserRegistration: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'User full name', minLength: 1 },
            email: { type: 'string', format: 'email', description: 'User email address' },
            password: { type: 'string', description: 'User password', minLength: 6 }
          },
          required: ['name', 'email', 'password']
        },
        UserAuthentication: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email', description: 'User email address' },
            password: { type: 'string', description: 'User password', minLength: 6 }
          },
          required: ['email', 'password']
        },
        AuthenticationResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', description: 'JWT access token' }
          },
          required: ['token']
        },
        Gym: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'Unique gym identifier' },
            title: { type: 'string', description: 'Gym name' },
            description: { type: 'string', nullable: true, description: 'Gym description' },
            phone: { type: 'string', nullable: true, description: 'Gym phone number' },
            latitude: { type: 'number', description: 'Gym latitude coordinate', minimum: -90, maximum: 90 },
            longitude: { type: 'number', description: 'Gym longitude coordinate', minimum: -180, maximum: 180 }
          },
          required: ['id', 'title', 'latitude', 'longitude']
        },
        GymCreation: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Gym name', minLength: 1 },
            description: { type: 'string', nullable: true, description: 'Gym description' },
            phone: { type: 'string', nullable: true, description: 'Gym phone number' },
            latitude: { type: 'number', description: 'Gym latitude coordinate', minimum: -90, maximum: 90 },
            longitude: { type: 'number', description: 'Gym longitude coordinate', minimum: -180, maximum: 180 }
          },
          required: ['title', 'latitude', 'longitude']
        },
        CheckIn: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'Unique check-in identifier' },
            created_at: { type: 'string', format: 'date-time', description: 'Check-in creation timestamp' },
            validated_at: { type: 'string', format: 'date-time', nullable: true, description: 'Check-in validation timestamp' },
            user_id: { type: 'string', format: 'uuid', description: 'User who performed the check-in' },
            gym_id: { type: 'string', format: 'uuid', description: 'Gym where check-in occurred' }
          },
          required: ['id', 'created_at', 'user_id', 'gym_id']
        },
        CheckInCreation: {
          type: 'object',
          properties: {
            latitude: { type: 'number', description: 'User latitude coordinate', minimum: -90, maximum: 90 },
            longitude: { type: 'number', description: 'User longitude coordinate', minimum: -180, maximum: 180 }
          },
          required: ['latitude', 'longitude']
        },
        CheckInMetrics: {
          type: 'object',
          properties: {
            checkInsCount: { type: 'number', description: 'Total number of check-ins for the user' }
          },
          required: ['checkInsCount']
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            items: { type: 'array', items: { type: 'object' } },
            page: { type: 'number', description: 'Current page number' },
            totalPages: { type: 'number', description: 'Total number of pages' },
            totalItems: { type: 'number', description: 'Total number of items' }
          },
          required: ['items', 'page']
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', description: 'Error message' },
            issues: { type: 'object', description: 'Validation issues (when applicable)' }
          },
          required: ['message']
        },
        ValidationError: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Validation error.' },
            issues: { type: 'object', description: 'Zod validation error details' }
          },
          required: ['message', 'issues']
        },
        UserAlreadyExistsError: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'User with this email already exists.' }
          },
          required: ['message']
        },
        InvalidCredentialsError: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Invalid credentials.' }
          },
          required: ['message']
        },
        MaxDistanceError: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Gym is too far away from your location.' }
          },
          required: ['message']
        },
        MaxNumberOfCheckinsError: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Maximum number of check-ins reached for today.' }
          },
          required: ['message']
        },
        LateCheckinValidationError: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Check-in can only be validated within 20 minutes of creation.' }
          },
          required: ['message']
        },
        ResourceNotFoundError: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Resource not found.' }
          },
          required: ['message']
        }
      }
    },
    tags: [
      {
        name: 'Users',
        description: 'User management operations including registration, authentication, and profile management'
      },
      {
        name: 'Gyms',
        description: 'Gym management operations including creation, search, and location-based queries'
      },
      {
        name: 'Check-ins',
        description: 'Check-in operations including creation, validation, history, and metrics'
      }
    ],
    security: [
      {
        bearerAuth: []
      }
    ],
    externalDocs: {
      description: 'Find more info about this API',
      url: 'https://github.com/OTAIMER20/gympasssolidapi'
    }
  }
})

app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  },
  staticCSP: true,
  transformStaticCSP: (header) => header
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkinsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'prod') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
