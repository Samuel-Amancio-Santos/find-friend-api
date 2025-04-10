import { app } from '@/app'
import request from 'supertest'

export async function createAndAuthenticateOrg() {
  await request(app.server).post('/orgs').send({
    name: 'PetLife',
    email: 'SamuelAmancio23Admin1@gmail.com',
    password: '123123',
    cep: '88010080',
    phone: '5581984878733',
    adress: 'Rua honorato',
  })

  const authenticate = await request(app.server).post('/sessions').send({
    email: 'SamuelAmancio23Admin1@gmail.com',
    password: '123123',
  })

  const userToken = authenticate.body.token

  return {
    userToken,
  }
}
