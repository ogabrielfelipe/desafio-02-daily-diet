import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('diets', (table) => {
    table.string('userId').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('diets', (table) => {
    table.dropColumn('userId')
  })
}
