import { randomUUID } from 'crypto'
import { knex } from '../database'
import { dietInterface } from '../@types/dietInterfaces'
import moment from 'moment-timezone'

export async function createDiet(diet: dietInterface) {
  const dietCreated = await knex('diets')
    .insert({
      id: randomUUID(),
      name: diet.name,
      description: diet.description,
      time: moment(diet.time)
        .tz('America/Sao_Paulo')
        .format('DD-MM-YYYY HH:mm:ss'),
      isDiet: diet.isDiet,
      userId: diet.userId,
      created_at: moment()
        .tz('America/Sao_Paulo')
        .format('DD-MM-YYYY HH:mm:ss'),
      updated_at: moment()
        .tz('America/Sao_Paulo')
        .format('DD-MM-YYYY HH:mm:ss'),
    })
    .returning('*')

  return dietCreated
}

export async function updateDiet(
  id: string,
  userId: string,
  diet: dietInterface,
) {
  const dietUpdated = await knex('diets')
    .update({
      name: diet.name,
      description: diet.description,
      time: moment(diet.time)
        .tz('America/Sao_Paulo')
        .format('DD-MM-YYYY HH:mm:ss'),
      isDiet: diet.isDiet,
      updated_at: moment()
        .tz('America/Sao_Paulo')
        .format('DD-MM-YYYY HH:mm:ss'),
    })
    .where({ id, userId })
    .returning('*')

  return dietUpdated
}

export async function deleteDiet(id: string, userId: string) {
  return await knex('diets').where({ id, userId }).del().returning('id')
}

export async function listDiets(userId: string) {
  const users: dietInterface[] = await knex('diets').where({
    userId,
  })
  return users
}

export async function getDietById(id: string, userId: string) {
  const user: dietInterface = await knex('diets')
    .where({
      id,
      userId,
    })
    .first()
  return user
}

export async function SummaryDiet(userId: string) {
  const totalDiet = await knex('diets')
    .where('userId', userId)
    .count('id', { as: 'total' })
    .first()
  const totalIsDiet = await knex('diets')
    .where({
      isDiet: true,
      userId,
    })
    .count('id', { as: 'total' })
    .first()
  const totalIsNotDiet = await knex('diets')
    .where({
      isDiet: false,
      userId,
    })
    .count('id', { as: 'total' })
    .first()
  return {
    totalDiet: totalDiet?.total,
    totalIsDiet: totalIsDiet?.total,
    totalIsNotDiet: totalIsNotDiet?.total,
  }
}
