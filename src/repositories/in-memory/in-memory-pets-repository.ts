import { Pet, Prisma } from '@prisma/client'
import { FilterCharacteristics, PetsRepository } from '../pets-repository'
import { randomUUID } from 'node:crypto'
import { InMemoryOrgsRepository } from './in-memory-orgs-repository'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  constructor(private orgsRepository: InMemoryOrgsRepository) {}

  async findById(petId: string): Promise<Pet | null> {
    const pet = this.items.find((item) => item.id === petId)

    if (!pet) {
      return null
    }

    return pet
  }

  async findByAll(params: FilterCharacteristics): Promise<Pet[] | null> {
    const orgs = this.orgsRepository.items.filter(
      (org) =>
        org.city?.toLocaleLowerCase() === params.city.toLocaleLowerCase() &&
        org.state?.toLocaleLowerCase() === params.state.toLocaleLowerCase(),
    )

    const orgIds = orgs?.map((org) => org.id)

    const pets = this.items
      .filter((pet) => orgIds?.includes(pet.org_id) && pet.adoptedAt === null)
      .filter((item) => (params.age ? item.age === params.age : true))
      .filter((item) => (params.size ? item.size === params.size : true))
      .filter((item) => (params.energy ? item.energy === params.energy : true))
      .filter((item) =>
        params.levelDependency
          ? item.levelDependency === params.levelDependency
          : true,
      )

    if (pets.length === 0) {
      return null
    }

    return pets
  }

  async createPet(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = {
      id: randomUUID(),
      name: data.name,
      adoptedAt: data.adoptedAt ? new Date(data.adoptedAt) : null,
      age: data.age,
      size: data.size,
      energy: data.energy,
      petPictures: new Uint8Array() ?? null,
      levelDependency: data.levelDependency,
      requirements: Array.isArray(data.requirements) ? data.requirements : [],
      org_id: data.org_id ?? randomUUID(),
      created_at: new Date(),
    }
    this.items.push(pet)

    return pet
  }
}
