import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { RegisterOrgsUseCase } from './register-orgs'
import { expect, describe, beforeEach, it } from 'vitest'
import { CepError } from './errors/cep-error'

let orgsRepository: InMemoryOrgsRepository
let sut: RegisterOrgsUseCase

describe('CEP API Tests', () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterOrgsUseCase(orgsRepository)
  })

  it('Should be able to get a true Cep', async () => {
    const { org } = await sut.execute({
      name: 'Samuel',
      email: 'samuelAmancio@gmail.com',
      password: '123123',
      cep: '51011065',
      phone: '5581982764355',
      adress: '',
    })
    expect(org.state).toEqual('PE')
    expect(org.city).toEqual('Recife')
  })
  it.skip('Should not be able to execute with wrong cep', async () => {
    await expect(async () => {
      await sut.execute({
        name: 'Samuel',
        email: 'samuel@gmail.com',
        password: '123123',
        cep: '5002234',
        phone: '5581982764355',
        adress: 'Rua 2',
      })
    }).rejects.toBeInstanceOf(CepError)
  }, 20000)
})
