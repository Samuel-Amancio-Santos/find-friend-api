import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { EmailAlreadyExistsError } from '@/services/errors/email-is-already-exists'
import { CepError } from '@/services/errors/cep-error'
import { makeRegisterOrgsUseCase } from '@/services/factories/make-register-org-use-case'
import { PhoneFormatError } from '@/services/errors/phoneFormat-error'

export async function registerOrg(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerOrgsBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    cep: z.string().min(8),
    adress: z.string(),
    phone: z.string(),
  })

  const { name, email, password, cep, phone, adress } =
    registerOrgsBodySchema.parse(request.body)
  try {
    const resgisterOrgsUseCase = makeRegisterOrgsUseCase()

    await resgisterOrgsUseCase.execute({
      name,
      email,
      password,
      cep,
      phone,
      adress,
    })
  } catch (err) {
    if (err instanceof CepError) {
      return reply.status(409).send({ message: err.message })
    } else if (err instanceof EmailAlreadyExistsError) {
      return reply.status(502).send({ message: err.message })
    } else if (err instanceof PhoneFormatError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }
  return reply.status(201).send()
}
