import { app } from '@/app'
import { describe, afterAll, beforeAll, expect, it } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'

describe('Create tests ', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create pet', async () => {
    const token = await createAndAuthenticateOrg()

    const response = await request(app.server)
      .post('/create')
      .send({
        name: 'Bolt',
        age: 'Filhote',
        size: 'pequeno porte',
        energy: '03',
        levelDependency: 'strong',
        requirements: ['Apartamento de grande porte', 'dependente de atenção'],
      })
      .set('Authorization', `Bearer ${token.userToken}`)

    expect(response.statusCode).toEqual(201)
  })
})
