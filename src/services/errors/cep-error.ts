export class CepError extends Error {
  constructor() {
    super('The CEP was not found or was typed incorrectly.')
  }
}
