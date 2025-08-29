import request from 'supertest'
import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'

describe('Create Checkin (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'Typescript Gym',
        latitude: -27.2092052,
        longitude: -49.6401091
      }
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/checkins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -27.2092052,
        longitude: -49.6401091
      })

    expect(response.statusCode).toEqual(201)
  })
})
