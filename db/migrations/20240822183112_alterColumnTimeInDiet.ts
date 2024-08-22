import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('diets', (table) => {
    table.dropColumn('time')
  })
  await knex.schema.alterTable('diets', (table) => {
    table.datetime('time').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('diets', (table) => {
    table.dropColumn('time')
  })
  await knex.schema.alterTable('diets', (table) => {
    table.string('time')
  })
}
