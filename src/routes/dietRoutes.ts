import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import {
  createDiet,
  deleteDiet,
  getDietById,
  listDiets,
  SummaryDiet,
  updateDiet,
} from '../services/dietService'
import { checkUserIdExists } from '../middlewares/checkUserIdExists'
import { dietInterface } from '../@types/dietInterfaces'

export async function dietRouter(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkUserIdExists],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const createDietBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        time: z.string().datetime({ offset: true }),
        isDiet: z.boolean().default(true),
      })

      const { userId } = request.cookies

      const dietReq = createDietBodySchema.parse(request.body)

      const dietWithUserId = {
        ...dietReq,
        userId: userId as string,
      }

      const dietCreated = await createDiet(dietWithUserId)

      return reply.status(201).send({ data: dietCreated })
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const getDietParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const { userId } = request.cookies
      const { id } = getDietParamsSchema.parse(request.params)

      const diet = await deleteDiet(id as string, userId as string)
      return reply.status(204).send({ data: diet })
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const updateDietBodySchema = z.object({
        name: z.string().nullable(),
        description: z.string().nullable(),
        time: z.string().datetime({ offset: true }).nullable(),
        isDiet: z.boolean().default(true).nullable(),
      })

      const getDietIdParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { userId } = request.cookies
      const dietReq = updateDietBodySchema.parse(request.body)
      const { id } = getDietIdParamsSchema.parse(request.params)

      const getDiet = await getDietById(id as string, userId as string)
      if (!getDiet) {
        throw new Error('Diet not found.')
      }

      const dietUpdated: dietInterface = {
        name:
          dietReq.name === null || dietReq.name === getDiet.name
            ? getDiet.name
            : dietReq.name,
        description:
          dietReq.description === null ||
          dietReq.description === getDiet.description
            ? getDiet.description
            : dietReq.description,
        time:
          dietReq.time === null || dietReq.time === getDiet.time
            ? getDiet.time
            : dietReq.time,
        isDiet:
          dietReq.isDiet === null || dietReq.isDiet === getDiet.isDiet
            ? getDiet.isDiet
            : dietReq.isDiet,
        userId: userId as string,
      }

      const updatedDiet = await updateDiet(id, userId as string, dietUpdated)

      return reply.status(200).send({ data: updatedDiet })
    },
  )

  app.get(
    '/',
    {
      preHandler: [checkUserIdExists],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { userId } = request.cookies

      const diets = await listDiets(userId as string)
      return reply.status(200).send({ data: diets })
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const getDietParamsSchema = z.object({
        id: z.string().uuid(),
      })
      const { userId } = request.cookies
      const { id } = getDietParamsSchema.parse(request.params)

      const diet = await getDietById(id as string, userId as string)
      return reply.status(200).send({ data: diet })
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkUserIdExists],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { userId } = request.cookies

      const diet = await SummaryDiet(userId as string)
      return reply.status(200).send({ data: diet })
    },
  )
}
