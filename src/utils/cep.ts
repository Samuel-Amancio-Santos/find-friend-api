import cep from 'cep-promise'

export async function findCep(cepCode: string) {
  try {
    const endereco = await cep(cepCode)
    return endereco
  } catch (err) {
    return null
  }
}
