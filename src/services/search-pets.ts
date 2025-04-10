import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'
import { NotFoundPetsError } from './errors/not-found-pets-error'

interface SearchPetsUseCaseRequest {
  city: string
  state: string
  age?: string
  energy?: string
  size?: string
  levelDependency?: string
}

interface SearchPetsUseCaseResponse {
  pets: Pet[]
}

export class SearchPetsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    city,
    state,
    age,
    energy,
    size,
    levelDependency,
  }: SearchPetsUseCaseRequest): Promise<SearchPetsUseCaseResponse> {
    const pets = await this.petsRepository.findByAll({
      city,
      state,
      age,
      energy,
      size,
      levelDependency,
    })

    if (!pets) {
      throw new NotFoundPetsError()
    }

    return { pets }
  }
}
