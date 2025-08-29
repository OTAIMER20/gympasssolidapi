import { FastifyInstance } from "fastify"
import { verifyJWT } from "../../middlewares/verify-jwt"
import { create } from "./create"
import { validate } from "./validate"
import { history } from "./history"
import { metrics } from "./metrics"
import { verifyUserRole } from "../../middlewares/verify-user-role"


export async function checkinsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/checkins/history', {
    schema: {
      tags: ['Check-ins'],
      summary: 'Get check-in history',
      description: 'Retrieves the check-in history for the authenticated user with pagination',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
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
          description: 'User check-in history retrieved successfully',
          type: 'object',
          properties: {
            checkIns: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid', description: 'Unique check-in identifier' },
                  created_at: { type: 'string', format: 'date-time', description: 'Check-in creation timestamp' },
                  validated_at: { type: 'string', format: 'date-time', nullable: true, description: 'Check-in validation timestamp' },
                  user_id: { type: 'string', format: 'uuid', description: 'User who performed the check-in' },
                  gym_id: { type: 'string', format: 'uuid', description: 'Gym where check-in occurred' }
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
  }, history)

  app.get('/checkins/metrics', {
    schema: {
      tags: ['Check-ins'],
      summary: 'Get check-in metrics',
      description: 'Retrieves check-in statistics and metrics for the authenticated user',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Check-in metrics retrieved successfully',
          type: 'object',
          properties: {
            checkInsCount: { type: 'number', description: 'Total number of check-ins for the user' }
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
  }, metrics)

  app.post('/gyms/:gymId/checkins', {
    schema: {
      tags: ['Check-ins'],
      summary: 'Create check-in',
      description: 'Performs a check-in at the specified gym using user coordinates',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['gymId'],
        properties: {
          gymId: {
            type: 'string',
            format: 'uuid',
            description: 'Unique identifier of the gym'
          }
        }
      },
      body: {
        type: 'object',
        required: ['latitude', 'longitude'],
        properties: {
          latitude: { type: 'number', description: 'User latitude coordinate', minimum: -90, maximum: 90 },
          longitude: { type: 'number', description: 'User longitude coordinate', minimum: -180, maximum: 180 }
        }
      },
      response: {
        201: {
          description: 'Check-in successfully created',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Check-in created successfully' }
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
          description: 'Validation error or business rule violation',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Validation error or business rule violation' }
          }
        },
        404: {
          description: 'Gym not found',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Gym not found' }
          }
        }
      }
    },
  }, create)

  app.patch('/checkins/:checkInId/validate', {
    schema: {
      tags: ['Check-ins'],
      summary: 'Validate check-in',
      description: 'Validates a user check-in (Admin users only)',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['checkInId'],
        properties: {
          checkInId: {
            type: 'string',
            format: 'uuid',
            description: 'Unique identifier of the check-in to validate'
          }
        }
      },
      response: {
        204: {
          description: 'Check-in validated successfully'
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
        404: {
          description: 'Check-in not found',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Check-in not found' }
          }
        }
      }
    },
    onRequest: [verifyUserRole('ADMIN')],
  }, validate)

}