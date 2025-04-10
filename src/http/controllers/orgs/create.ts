import { InvalidCredentialsError } from '@/services/errors/resource-error'
import { makeCreatePetUseCase } from '@/services/factories/make-org-create-pets-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createPetBodySchema = z.object({
    name: z.string(),
    age: z.string(),
    size: z.string(),
    levelDependency: z.string(),
    energy: z.string(),
    requirements: z.string().array(),
  })

  const { name, age, size, levelDependency, energy, requirements } =
    createPetBodySchema.parse(request.body)

  try {
    const orgCreatePetUseCase = makeCreatePetUseCase()

    await orgCreatePetUseCase.execute({
      org_id: request.user.sub,
      name,
      age,
      size,
      levelDependency,
      energy,
      requirements,
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
  return reply.status(201).send()
}
