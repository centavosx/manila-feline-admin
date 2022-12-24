export enum Roles {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  USER = 'user',
}

export type Role = {
  id: string
  name: Roles
}
