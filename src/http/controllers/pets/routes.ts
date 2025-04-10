import { FastifyInstance } from 'fastify'
import { getProfile } from './get-profile'
import { searchPets } from './search-pets'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets', searchPets)
  app.get('/pets/:petId', getProfile)
}
