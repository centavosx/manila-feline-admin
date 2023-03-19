import { Services } from './service.entity'
import { User } from './user.entity'

export enum Status {
  pending = 'Pending',
  accepted = 'Accepted',
  completed = 'Completed',
  cancelled = 'Cancelled',
}

export enum AmOrPm {
  AM = 'AM',
  PM = 'PM',
}

export enum Gender {
  male = 'MALE',
  female = 'FEMALE',
}

export type Appointment = {
  id: string

  refId: string

  name: string

  email: string

  message: string

  startDate: Date

  date?: Date

  endDate: Date

  status: Status

  time: AmOrPm

  petName: string | null

  birthDate: string | null

  age: number | null

  gender: Gender | null

  verification: string | null

  service: Services

  doctor: User

  created: Date

  modified: Date
}
