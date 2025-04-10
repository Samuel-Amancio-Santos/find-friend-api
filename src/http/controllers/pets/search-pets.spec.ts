import { app } from '@/app'
import { describe, afterAll, beforeAll, expect, it } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'

describe('Search pets ', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search pets', async () => {
    const token = await createAndAuthenticateOrg()

    await request(app.server)
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

    await request(app.server)
      .post('/create')
      .send({
        name: 'Bob',
        age: 'Adulto',
        size: 'Grande porte',
        energy: '03',
        levelDependency: 'strong',
        requirements: ['Apartamento de grande porte', 'dependente de atenção'],
      })
      .set('Authorization', `Bearer ${token.userToken}`)

    const response = await request(app.server).get('/pets').query({
      city: 'Florianópolis',
      state: 'SC',
      age: 'Adulto',
      //   energy: '',
      //   size: '', // optional querys
      //   levelDependency: '',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Bob',
        }),
      ]),
    )
  })
})
