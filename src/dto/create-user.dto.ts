import { Roles } from 'entities'

export type CreateUserDto = {
  name?: string

  email?: string

  password?: string

  role?: Roles

  position?: string

  description?: string
}
