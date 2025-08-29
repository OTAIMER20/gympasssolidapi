import request from 'supertest'
import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'

describe('Validate Checkin (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validate a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'Typescript Gym',
        latitude: -27.2092052,
        longitude: -49.6401091
      }
    })

    let checkin = await prisma.chekin.create({
      data: {
        gym_id: gym.id,
        user_id: user.id
      }
    })

    const response = await request(app.server)
      .patch(`/checkins/${checkin.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)

    checkin = await prisma.chekin.findFirstOrThrow({
      where: {
        id: checkin.id
      }
    })

    expect(checkin.validated_at).toEqual(expect.any(Date))
  })

})
