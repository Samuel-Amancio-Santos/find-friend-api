import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'

interface OrgCreatePetsUseCaseRequest {
  org_id: string
  name: string
  age: string
  size: string
  energy: string
  levelDependency: string
  petPictures?: Uint8Array
  requirements: string[]
}

interface OrgCreatePetsUseCaseResponse {
  pet: Pet
}

export class OrgCreatePetsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    org_id,
    name,
    age,
    size,
    levelDependency,
    energy,
    requirements,
  }: OrgCreatePetsUseCaseRequest): Promise<OrgCreatePetsUseCaseResponse> {
    const pet = await this.petsRepository.createPet({
      org_id,
      name,
      age,
      size,
      energy,
      levelDependency,
      requirements,
    })
    return {
      pet,
    }
  }
}
