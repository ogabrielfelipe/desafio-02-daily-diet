import { randomUUID } from 'crypto'
import { knex } from '../database'
import { userInterface } from '../@types/userInterfaces'

export async function createUser(user: userInterface) {
  const userCreated = await knex('users')
    .insert({
      id: randomUUID(),
      name: user.name,
      email: user.email,
    })
    .returning('*')

  return userCreated[0]
}

export async function getUserById(userId: string) {
  const user = await knex('users').where('id', userId).first()
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}

export async function getUserByNameAndEmail(user: userInterface) {
  const userFind = await knex('users')
    .where({
      name: user.name,
      email: user.email,
    })
    .returning(['id', 'name', 'email'])
    .first()

  return userFind
}
