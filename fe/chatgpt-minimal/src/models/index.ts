export interface Message {
  type: Role
  message: string
}

export type Role = 'assistant' | 'user'
