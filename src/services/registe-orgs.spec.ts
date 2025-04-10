import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { RegisterOrgsUseCase } from './register-orgs'
import { expect, describe, beforeEach, it, vi } from 'vitest'
import { compare } from 'bcryptjs'
import { EmailAlreadyExistsError } from './errors/email-is-already-exists'
import { PhoneFormatError } from './errors/phoneFormat-error'

// Mockando a função findCep no Vitest para sempre retornar um endereço fixo, sem chamar a API real.
vi.mock('../utils/cep', () => ({
  findCep: vi.fn().mockResolvedValue({
    state: 'SP',
    city: 'São Paulo',
    neighborhood: 'Centro',
    street: 'Rua Exemplo',
  }),
}))

let orgsRepository: InMemoryOrgsRepository
let sut: RegisterOrgsUseCase

describe('Register Orgs Use Case Tests', () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterOrgsUseCase(orgsRepository)
  })

  it('Should be able to hash password', async () => {
    const { org } = await sut.execute({
      name: 'Samuel',
      email: 'samuelAmancio@gmail.com',
      password: '123123',
      cep: '123123',
      phone: '+55 81 9 8276-4355',
      adress: 'Rua 2',
    })

    const isPasswordCorrectlyHashed = await compare('123123', org.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
  it('Should be able to hash password', async () => {
    const { org } = await sut.execute({
      name: 'Samuel',
      email: 'samuelAmancio@gmail.com',
      password: '123123',
      cep: '12312323',
      phone: '5581982764355',
      adress: 'Rua 2',
    })

    await expect(async () => {
      await sut.execute({
        name: 'Samuel',
        email: org.email,
        password: '123123',
        cep: '123123',
        phone: '5581982764355',
        adress: 'Rua 2',
      })
    }).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })

  it('Should not be able to type invalid phone number format', async () => {
    await expect(
      async () =>
        await sut.execute({
          name: 'Samuel',
          email: 'samuelAmancio@gmail.com',
          password: '123123',
          cep: '123123',
          phone: '982988',
          adress: 'Rua 2',
        }),
    ).rejects.toBeInstanceOf(PhoneFormatError)
  })
})
