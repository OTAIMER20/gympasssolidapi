import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/prisma'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance, isAdmin = false) {
  await prisma.user.create({
    data: {
      name: 'Gabriel Otaimer',
      email: 'otaimer@gabriel.com',
      password_hash: await hash('yaya1234', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER'
    }
  })

  const authResponse = await request(app.server)
    .post('/sessions')
    .send({
      email: 'otaimer@gabriel.com',
      password: 'yaya1234'
    })

  const { token } = authResponse.body

  return { token }
}