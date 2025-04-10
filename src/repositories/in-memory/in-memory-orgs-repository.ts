import { Org, Prisma, Role } from '@prisma/client'
import { OrgsRepository } from '../orgs-repository'
import { randomUUID } from 'crypto'

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []

  async findById(org_id: string): Promise<Org | null> {
    const org = this.items.find((item) => item.id === org_id)

    if (!org) {
      return null
    }

    return org
  }

  async findByEmail(email: string) {
    const org = this.items.find((item) => item.email === email)

    if (!org) {
      return null
    }

    return org
  }

  async create(data: Prisma.OrgCreateInput) {
    const org = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      cep: data.cep,
      adress: data.adress,
      state: data.state ?? null,
      city: data.city ?? null,
      neighborhood: data.neighborhood ?? null,
      street: data.street ?? null,
      phone: data.phone,
      role: data.role ?? Role.ADMIN,
      created_at: new Date(),
    }

    this.items.push(org)

    return org
  }
}
