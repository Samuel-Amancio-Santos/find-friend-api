export function phoneFormat(phone: string): string | null {
  const phoneFormat = phone.replace(/[^a-zA-Z0-9]/g, '')

  if (!phoneFormat || phoneFormat.length !== 13) {
    return null
  }

  return phoneFormat
}
