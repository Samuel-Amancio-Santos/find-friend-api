import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { FilterCharacteristics, PetsRepository } from '../pets-repository'

export class PrismaPetsRepository implements PetsRepository {
  async createPet(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }

  async findByAll(params: FilterCharacteristics) {
    const pets = await prisma.pet.findMany({
      where: {
        age: params.age,
        energy: params.energy,
        size: params.size,
        levelDependency: params.levelDependency,
        adoptedAt: null,
        org: {
          city: {
            contains: params.city,
            mode: 'insensitive',
          },
          state: {
            contains: params.state,
            mode: 'insensitive',
          },
        },
      },
    })

    return pets
  }

  async findById(petId: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id: petId,
      },
    })

    return pet
  }
}
