import { makeSearchPetsUseCase } from '@/services/factories/make-search-pets-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function searchPets(request: FastifyRequest, reply: FastifyReply) {
  const searchPetsQuerySchema = z.object({
    city: z.string(),
    state: z.string(),
    age: z.string().optional(),
    energy: z.string().optional(),
    size: z.string().optional(),
    levelDependency: z.string().optional(),
  })

  const { city, state, age, energy, size, levelDependency } =
    searchPetsQuerySchema.parse(request.query)

  const searchPets = makeSearchPetsUseCase()

  const { pets } = await searchPets.execute({
    city,
    state,
    age,
    energy,
    levelDependency,
    size,
  })

  return reply.status(200).send({
    pets,
  })
}
