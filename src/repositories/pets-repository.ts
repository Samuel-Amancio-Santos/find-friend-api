import { Pet, Prisma } from '@prisma/client'

export interface FilterCharacteristics {
  city: string
  state: string
  age?: string
  energy?: string
  size?: string
  levelDependency?: string
}

export interface PetsRepository {
  createPet(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  findByAll(params: FilterCharacteristics): Promise<Pet[] | null>
  findById(petId: string): Promise<Pet | null>
}
