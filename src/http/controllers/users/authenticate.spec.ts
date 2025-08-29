import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Gabriel Otaimer',
        email: 'otaimer@gabriel.com',
        password: 'yaya1234'
      })

    const response = await request(app.server)
      .post('/sessions')
      .send({
        email: 'otaimer@gabriel.com',
        password: 'yaya1234'
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({ token: expect.any(String) })
  })
})
