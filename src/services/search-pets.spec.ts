import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { describe, beforeEach, it, expect } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { SearchPetsUseCase } from './search-pets'
import { NotFoundPetsError } from './errors/not-found-pets-error'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: SearchPetsUseCase

describe('Search Pets', () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new SearchPetsUseCase(petsRepository)
  })

  it('Should be able to search a pet', async () => {
    for (let i = 0; i <= 5; i++) {
      await orgsRepository.create({
        id: `org_${i}`,
        name: 'Samuel',
        email: `samuelAmancio@gmail.com`,
        password_hash: '123123',
        cep: '51011065',
        phone: '+55 81 9 8276-4355',
        adress: 'Rua 2',
        city: 'Florianópolis',
        state: 'SC',
      })

      await petsRepository.createPet({
        org_id: `org_${i}`,
        name: 'Fifi',
        age: 'Filhote',
        size: 'pequeno porte',
        energy: '03',
        levelDependency: 'strong',
        requirements: ['Apartamento', 'grande'],
      })
    }
    for (let i = 0; i <= 5; i++) {
      await petsRepository.createPet({
        org_id: `org_${i}`,
        adoptedAt: new Date(),
        name: 'Fifi',
        age: 'Filhote',
        size: 'pequeno porte',
        energy: '03',
        levelDependency: 'strong',
        requirements: ['Apartamento', 'grande'],
      })
    }

    const { pets } = await sut.execute({
      city: 'Florianópolis',
      state: 'SC',
      age: 'Filhote',
      energy: '03',
      levelDependency: 'strong',
    })

    expect(pets.length).toEqual(6)
  })

  it('No pets found for adoption.', async () => {
    for (let i = 0; i <= 5; i++) {
      await orgsRepository.create({
        id: `org_${i}`,
        name: 'Samuel',
        email: `samuelAmancio@gmail.com`,
        password_hash: '123123',
        cep: '51011065',
        phone: '+55 81 9 8276-4355',
        adress: 'Rua 2',
        city: 'Florianópolis',
        state: 'SC',
      })

      await petsRepository.createPet({
        org_id: `org_${i}`,
        adoptedAt: new Date(),
        name: 'Fifi',
        age: 'Filhote',
        size: 'pequeno porte',
        energy: '03',
        levelDependency: 'strong',
        requirements: ['Apartamento', 'grande'],
      })
    }

    await expect(async () => [
      await sut.execute({
        city: 'Florianópolis',
        state: 'SC',
        age: 'Filhote',
      }),
    ]).rejects.toBeInstanceOf(NotFoundPetsError)
  })
})
