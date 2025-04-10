import { OrgsRepository } from '@/repositories/orgs-repository'
import { findCep } from '@/utils/cep'
import { Org } from '@prisma/client'
import { hash } from 'bcryptjs'
import { CepError } from './errors/cep-error'
import { EmailAlreadyExistsError } from './errors/email-is-already-exists'
import { PhoneFormatError } from './errors/phoneFormat-error'
import { phoneFormat } from '@/utils/formatPhone'

interface RegisterOrgsUseCaseRequest {
  name: string
  email: string
  password: string
  cep: string
  phone: string
  adress: string
}

interface OrgsUseCaseResponse {
  org: Org
}

export class RegisterOrgsUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    name,
    email,
    password,
    cep,
    phone,
    adress,
  }: RegisterOrgsUseCaseRequest): Promise<OrgsUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const adressFromCepPromise = await findCep(cep)

    if (!adressFromCepPromise) {
      throw new CepError()
    }

    const userWithSameEmail = await this.orgsRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new EmailAlreadyExistsError()
    }

    const isPhoneCorrectlyFormat = phoneFormat(phone)

    if (!isPhoneCorrectlyFormat) {
      throw new PhoneFormatError()
    }

    const org = await this.orgsRepository.create({
      name,
      email,
      password_hash,
      cep,
      phone,
      adress,
      state: adressFromCepPromise.state,
      city: adressFromCepPromise.city,
      neighborhood: adressFromCepPromise.neighborhood,
      street: adressFromCepPromise.street,
    })

    return {
      org,
    }
  }
}
