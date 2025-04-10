import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { RegisterOrgsUseCase } from '../register-orgs'

export function makeRegisterOrgsUseCase() {
  const orgsRepository = new PrismaOrgsRepository()
  const registerOrgsUseCase = new RegisterOrgsUseCase(orgsRepository)

  return registerOrgsUseCase
}
