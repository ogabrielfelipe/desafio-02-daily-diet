import { randomUUID } from 'crypto'
import { knex } from '../database'

interface userInterface {
  name: string
  email: string
}

export async function createUser(user: userInterface) {
  const userCreated = await knex('users')
    .insert({
      id: randomUUID(),
      name: user.name,
      email: user.email,
    })
    .returning('*')

  return userCreated
}
