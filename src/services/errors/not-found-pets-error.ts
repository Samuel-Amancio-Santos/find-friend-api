export class NotFoundPetsError extends Error {
  constructor() {
    super('No pets found for adoption.')
  }
}
