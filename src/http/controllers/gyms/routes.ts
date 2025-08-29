import { FastifyInstance } from "fastify"
import { verifyJWT } from "../../middlewares/verify-jwt"
import { search } from "./search"
import { nearby } from "./neraby"
import { create } from "./create"
import { verifyUserRole } from "../../middlewares/verify-user-role"

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/gyms/search', {
    schema: {
      tags: ['Gyms'],
      summary: 'Search gyms',
      description: 'Search for gyms by name using pagination',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        required: ['q'],
        properties: {
          q: {
            type: 'string',
            description: 'Search query for gym name',
            minLength: 1
          },
          page: {
            type: 'number',
            description: 'Page number for pagination',
            minimum: 1,
            default: 1
          }
        }
      },
      response: {
        200: {
          description: 'List of gyms matching the search criteria',
          type: 'object',
          properties: {
            gyms: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid', description: 'Unique gym identifier' },
                  title: { type: 'string', description: 'Gym name' },
                  description: { type: 'string', nullable: true, description: 'Gym description' },
                  phone: { type: 'string', nullable: true, description: 'Gym phone number' },
                  latitude: { type: 'number', description: 'Gym latitude coordinate', minimum: -90, maximum: 90 },
                  longitude: { type: 'number', description: 'Gym longitude coordinate', minimum: -180, maximum: 180 }
                }
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
  }, search)

  app.get('/gyms/nearby', {
    schema: {
      tags: ['Gyms'],
      summary: 'Find nearby gyms',
      description: 'Find gyms within a certain distance from the given coordinates',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        required: ['latitude', 'longitude'],
        properties: {
          latitude: {
            type: 'number',
            description: 'User latitude coordinate',
            minimum: -90,
            maximum: 90
          },
          longitude: {
            type: 'number',
            description: 'User longitude coordinate',
            minimum: -180,
            maximum: 180
          }
        }
      },
      response: {
        200: {
          description: 'List of nearby gyms',
          type: 'object',
          properties: {
            gyms: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid', description: 'Unique gym identifier' },
                  title: { type: 'string', description: 'Gym name' },
                  description: { type: 'string', nullable: true, description: 'Gym description' },
                  phone: { type: 'string', nullable: true, description: 'Gym phone number' },
                  latitude: { type: 'number', description: 'Gym latitude coordinate', minimum: -90, maximum: 90 },
                  longitude: { type: 'number', description: 'Gym longitude coordinate', minimum: -180, maximum: 180 }
                }
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
  }, nearby)

  app.post('/gyms', {
    schema: {
      tags: ['Gyms'],
      summary: 'Create gym',
      description: 'Creates a new gym (Admin users only)',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['title', 'latitude', 'longitude'],
        properties: {
          title: { type: 'string', description: 'Gym name', minLength: 1 },
          description: { type: 'string', nullable: true, description: 'Gym description' },
          phone: { type: 'string', nullable: true, description: 'Gym phone number' },
          latitude: { type: 'number', description: 'Gym latitude coordinate', minimum: -90, maximum: 90 },
          longitude: { type: 'number', description: 'Gym longitude coordinate', minimum: -180, maximum: 180 }
        }
      },
      response: {
        201: {
          description: 'Gym successfully created',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Gym created successfully' }
          }
        },
        401: {
          description: 'Unauthorized - Invalid or missing JWT token',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Unauthorized' }
          }
        },
        403: {
          description: 'Forbidden - Admin role required',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Forbidden - Admin role required' }
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
    onRequest: [verifyUserRole('ADMIN')],
  }, create)

}