import { Role } from './role.entity'

export type UserRole = {
  id: string
  userId: string
  roleId: number
  user: User
  role: Role
}

export type User = {
  id: string
  name: string
  description: string
  password?: string
  email: string
  position: string
  roles: UserRole[]
  created: Date
  modified: Date
}
