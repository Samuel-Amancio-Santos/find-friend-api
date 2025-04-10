import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { expect, describe, beforeEach, it, vi } from 'vitest'
import { hash } from 'bcryptjs'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/resource-error'

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
let authenticate: AuthenticateUseCase

describe('Register Orgs Use Case Tests', () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()
    authenticate = new AuthenticateUseCase(orgsRepository)
  })

  it('Should be able to authenticate org', async () => {
    await orgsRepository.create({
      name: 'Samuel',
      email: 'samuelAmancio@gmail.com',
      password_hash: await hash('123123', 6),
      cep: '123123',
      phone: '5581982764355',
      adress: 'Rua 2',
    })

    const { org } = await authenticate.execute({
      email: 'samuelAmancio@gmail.com',
      password: '123123',
    })

    expect(org.id).toEqual(expect.any(String))
  })
  it('Should not be able to authenticate org with wrong password', async () => {
    await orgsRepository.create({
      name: 'Samuel',
      email: 'samuelAmancio@gmail.com',
      password_hash: await hash('123123', 6),
      cep: '123123',
      phone: '5581982764355',
      adress: 'Rua 2',
    })

    await expect(async () => {
      await authenticate.execute({
        email: 'samuelAmancio@gmail.com',
        password: '123122',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
  it('Should not be able to authenticate org with wrong email', async () => {
    await orgsRepository.create({
      name: 'Samuel',
      email: 'samuelAmancio@gmail.com',
      password_hash: await hash('123123', 6),
      cep: '123123',
      phone: '5581982764355',
      adress: 'Rua 2',
    })

    await expect(async () => {
      await authenticate.execute({
        email: 'samuelmancio@gmail.com',
        password: '123123',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
