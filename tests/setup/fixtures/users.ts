import { nanoid } from 'nanoid'

export const testUsers = [
  {
    id: nanoid(),
    email: 'admin@example.com',
    password_hash: '$2a$12$mockhashadmin',
    name: 'Admin User',
    role: 'admin' as const,
    created_at: new Date('2024-01-01').toISOString(),
    updated_at: new Date('2024-01-01').toISOString(),
  },
  {
    id: nanoid(),
    email: 'leader@example.com',
    password_hash: '$2a$12$mockhashleader',
    name: 'Leader User',
    role: 'leader' as const,
    created_at: new Date('2024-01-02').toISOString(),
    updated_at: new Date('2024-01-02').toISOString(),
  },
  {
    id: nanoid(),
    email: 'member@example.com',
    password_hash: '$2a$12$mockhashmember',
    name: 'Member User',
    role: 'member' as const,
    created_at: new Date('2024-01-03').toISOString(),
    updated_at: new Date('2024-01-03').toISOString(),
  },
]

export const testPlainPasswords = {
  admin: 'AdminPassword123!',
  leader: 'LeaderPassword123!',
  member: 'MemberPassword123!',
}
