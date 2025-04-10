import { describe, beforeEach, it, vi, expect } from 'vitest'
import { OrgCreatePetsUseCase } from './org-create-pets'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'

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
let petsRepository: InMemoryPetsRepository
let sut: OrgCreatePetsUseCase

describe('Org Create Pets', () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new OrgCreatePetsUseCase(petsRepository)
  })

  it('Should be able to create new pet', async () => {
    const org = await orgsRepository.create({
      name: 'Samuel',
      email: 'samuelAmancio@gmail.com',
      password_hash: '123123',
      cep: '123123',
      phone: '+55 81 9 8276-4355',
      adress: 'Rua 2',
    })

    await orgsRepository.create({
      name: 'Samuel',
      email: 'samuelAmancio@gmail.com',
      password_hash: '123123',
      cep: '123123',
      phone: '+55 81 9 8276-4355',
      adress: 'Rua 2',
    })

    const { pet } = await sut.execute({
      org_id: org.id,
      name: 'Fifi',
      age: 'Filhote',
      size: 'pequeno porte',
      energy: '03',
      levelDependency: 'strong',
      requirements: ['Apartamento', 'grande'],
    })

    expect(pet.org_id).toEqual(expect.any(String))
    expect(pet.id).toEqual(expect.any(String))
  })
})
