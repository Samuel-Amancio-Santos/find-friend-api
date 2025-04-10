import { Pet } from '@prisma/client'
import { InvalidCredentialsError } from './errors/resource-error'
import { PetsRepository } from '@/repositories/pets-repository'

interface GetPetProfileUseCaseRequest {
  id: string
}

interface GetPetProfileUseCaseResponse {
  pet: Pet
}

export class GetPetProfileUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    id,
  }: GetPetProfileUseCaseRequest): Promise<GetPetProfileUseCaseResponse> {
    const pet = await this.petsRepository.findById(id)

    if (!pet) {
      throw new InvalidCredentialsError()
    }

    return {
      pet,
    }
  }
}
