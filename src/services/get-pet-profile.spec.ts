import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { describe, beforeEach, it, vi, expect } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { GetPetProfileUseCase } from './get-pet-profile'
import { InvalidCredentialsError } from './errors/resource-error'

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
let sut: GetPetProfileUseCase

describe('Pet Profile', () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new GetPetProfileUseCase(petsRepository)
  })

  it('Should be able to get pet profile', async () => {
    const org = await orgsRepository.create({
      name: 'Samuel',
      email: 'samuelAmancio@gmail.com',
      password_hash: '123123',
      cep: '123123',
      phone: '+55 81 9 8276-4355',
      adress: 'Rua 2',
    })

    const pet1 = await petsRepository.createPet({
      org_id: org.id,
      name: 'Fifi',
      age: 'Filhote',
      size: 'pequeno porte',
      energy: '03',
      levelDependency: 'strong',
      requirements: ['Apartamento', 'grande'],
    })

    const { pet } = await sut.execute({
      id: pet1.id,
    })

    expect(pet.id).toEqual(expect.any(String))
    expect(pet.name).toEqual('Fifi')
  })

  it('Should not be able to get pet profile', async () => {
    const org = await orgsRepository.create({
      name: 'Samuel',
      email: 'samuelAmancio@gmail.com',
      password_hash: '123123',
      cep: '123123',
      phone: '+55 81 9 8276-4355',
      adress: 'Rua 2',
    })

    await petsRepository.createPet({
      org_id: org.id,
      name: 'Fifi',
      age: 'Filhote',
      size: 'pequeno porte',
      energy: '03',
      levelDependency: 'strong',
      requirements: ['Apartamento', 'grande'],
    })

    await expect(async () => {
      await sut.execute({
        id: '09898223',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
