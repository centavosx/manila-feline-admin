export const checkId = (id: string) =>
  /[0-f]{8}-[0-f]{4}-[0-f]{4}-[0-f]{4}-[0-f]{12}/.test(id)
