import { randomUUID } from 'crypto'
import { knex } from '../database'

interface dietInterface {
  name: string
  description: string
  time: string
  isDiet: boolean
}

export async function createDiet(diet: dietInterface) {
  console.log(diet)
  const dietCreated = await knex('diets')
    .insert({
      id: randomUUID(),
      name: diet.name,
      description: diet.description,
      time: diet.time,
      isDiet: diet.isDiet,
    })
    .returning('*')

  return dietCreated
}
