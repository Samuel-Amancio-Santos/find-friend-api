import { prisma } from '@/lib/prisma'
import { Org, Prisma } from '@prisma/client'
import { OrgsRepository } from '../orgs-repository'

export class PrismaOrgsRepository implements OrgsRepository {
  async findByCityState(city: string, state: string): Promise<Org[] | null> {
    const orgs = await prisma.org.findMany({
      where: {
        city,
        state,
      },
    })

    return orgs
  }

  async findById(orgId: string): Promise<Org | null> {
    const org = await prisma.org.findFirst({
      where: {
        id: orgId,
      },
    })

    return org
  }

  async findByEmail(email: string) {
    const org = await prisma.org.findUnique({
      where: {
        email,
      },
    })
    return org
  }

  async create(data: Prisma.OrgCreateInput) {
    const org = await prisma.org.create({
      data,
    })

    return org
  }
}
