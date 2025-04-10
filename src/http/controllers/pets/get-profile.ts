import { makeGetPetProfileUseCase } from '@/services/factories/make-get-pet-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
  const getProfileParamsSchema = z.object({
    petId: z.string().uuid(),
  })

  const { petId } = getProfileParamsSchema.parse(request.params)

  const getProfile = makeGetPetProfileUseCase()

  const { pet } = await getProfile.execute({
    id: petId,
  })

  return reply.status(200).send({
    pet,
  })
}
