import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Refresh Token', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh a token', async () => {
    await request(app.server).post('/orgs').send({
      name: 'PetLife',
      email: 'SamuelAmancio23Admin1@gmail.com',
      password: '123123',
      cep: '88010080',
      phone: '5581984878733',
      adress: 'Rua honorato',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'SamuelAmancio23Admin1@gmail.com',
      password: '123123',
    })

    const [cookies] = authResponse.headers['set-cookie']

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
