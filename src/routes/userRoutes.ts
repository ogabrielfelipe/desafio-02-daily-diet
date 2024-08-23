import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { createUser, getUserByNameAndEmail } from '../services/userService'
import { z } from 'zod'
import { userInterface } from '../@types/userInterfaces'

export async function userRouter(app: FastifyInstance) {
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const createTransactionBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    const userReq = createTransactionBodySchema.parse(request.body)

    let userCreated: userInterface

    const getUser: userInterface = await getUserByNameAndEmail(userReq)
    if (getUser) {
      userCreated = getUser
    } else {
      userCreated = await createUser(userReq)
    }

    reply.cookie('userId', userCreated.id as string, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias => Minutos * horas * dia * quantidade dias
    })

    return reply.status(201).send({ data: userCreated })
  })
}
