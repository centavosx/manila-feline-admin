export type Replies = {
  id: string

  message: string

  created: Date

  modified: Date
}

export type ContactUs = {
  id: string

  from: string

  name: string

  message: string

  subject: string

  replies: Replies[]

  created: Date
}
