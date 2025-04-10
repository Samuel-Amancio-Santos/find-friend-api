import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { SearchPetsUseCase } from '../search-pets'

export function makeSearchPetsUseCase() {
  const PetsRepository = new PrismaPetsRepository()
  const searchPetsUseCase = new SearchPetsUseCase(PetsRepository)

  return searchPetsUseCase
}
