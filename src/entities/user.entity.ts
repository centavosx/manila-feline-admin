import { Role } from './role.entity'
import { Services } from './service.entity'

export type UserRole = {
  id: string
  userId: string
  roleId: number
  user: User
  role: Role
}

export type Availability = {
  id: string
  startDate: Date
  endDate: Date
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
  services?: Services[]
  availability?: Availability[]
}
