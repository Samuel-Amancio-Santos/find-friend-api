export class PhoneFormatError extends Error {
  constructor() {
    super('Invalid phone format. Use: DD DD 9 XXXX-XXXX.')
  }
}
