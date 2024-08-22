import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { createDiet } from '../services/dietService'

export async function dietRouter(app: FastifyInstance) {
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const createTransactionBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      time: z.string().datetime({ offset: true }),
      isDiet: z.boolean().default(true),
    })

    const dietReq = createTransactionBodySchema.parse(request.body)

    const dietCreated = await createDiet(dietReq)

    return reply.status(201).send({ data: dietCreated })
  })
}
