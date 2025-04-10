import { app } from '@/app'
import { describe, afterAll, beforeAll, expect, it } from 'vitest'
import request from 'supertest'

describe('Authenticate tests ', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate org', async () => {
    await request(app.server).post('/orgs').send({
      name: 'PetLife',
      email: 'SamuelAmancio23Admin1@gmail.com',
      password: '123123',
      cep: '88010080',
      phone: '5581984878733',
      adress: 'Rua honorato',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'SamuelAmancio23Admin1@gmail.com',
      password: '123123',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
