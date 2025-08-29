import { FastifyInstance } from "fastify"
import { register } from "./register"
import { authenticate } from "./authenticate"
import { profile } from "./profile"
import { verifyJWT } from "../../middlewares/verify-jwt"
import { refresh } from "./refresh"

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', {
    schema: {
      tags: ['Users'],
      summary: 'Register a new user',
      description: 'Creates a new user account with the provided information',
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', description: 'User full name', minLength: 1 },
          email: { type: 'string', format: 'email', description: 'User email address' },
          password: { type: 'string', description: 'User password', minLength: 6 }
        }
      },
      response: {
        201: {
          description: 'User successfully created',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'User created successfully' }
          }
        },
        409: {
          description: 'User already exists',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'User with this email already exists.' }
          }
        },
        400: {
          description: 'Validation error',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Validation error.' },
            issues: { type: 'object', description: 'Validation issues' }
          }
        }
      }
    },
  }, register)

  app.post('/sessions', {
    schema: {
      tags: ['Users'],
      summary: 'Authenticate user',
      description: 'Authenticates user credentials and returns JWT access token',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', description: 'User email address' },
          password: { type: 'string', description: 'User password', minLength: 6 }
        }
      },
      response: {
        200: {
          description: 'Authentication successful',
          type: 'object',
          properties: {
            token: { type: 'string', description: 'JWT access token' }
          }
        },
        400: {
          description: 'Invalid credentials',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Invalid credentials.' }
          }
        }
      }
    },
  }, authenticate)

  app.patch('/token/refresh', {
    schema: {
      tags: ['Users'],
      summary: 'Refresh authentication token',
      description: 'Refreshes the JWT access token using the refresh token cookie',
      security: [],
      response: {
        200: {
          description: 'New token issued successfully',
          type: 'object',
          properties: {
            token: { type: 'string', description: 'JWT access token' }
          }
        },
        401: {
          description: 'Unauthorized - Invalid or expired refresh token',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Unauthorized' }
          }
        }
      }
    },
  }, refresh)

  app.get('/me', {
    schema: {
      tags: ['Users'],
      summary: 'Get user profile',
      description: 'Retrieves the profile information of the currently authenticated user',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'User profile data retrieved successfully',
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid', description: 'Unique user identifier' },
                name: { type: 'string', description: 'User full name' },
                email: { type: 'string', format: 'email', description: 'User email address' },
                role: { type: 'string', enum: ['ADMIN', 'MEMBER'], description: 'User role in the system' },
                created_at: { type: 'string', format: 'date-time', description: 'User creation timestamp' }
              }
            }
          }
        },
        401: {
          description: 'Unauthorized - Invalid or missing JWT token',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Unauthorized' }
          }
        }
      }
    },
    onRequest: [verifyJWT],
  }, profile)

}