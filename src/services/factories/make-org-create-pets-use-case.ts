import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { OrgCreatePetsUseCase } from '../org-create-pets'

export function makeCreatePetUseCase() {
  const PetsRepository = new PrismaPetsRepository()
  const createPetUseCase = new OrgCreatePetsUseCase(PetsRepository)

  return createPetUseCase
}
