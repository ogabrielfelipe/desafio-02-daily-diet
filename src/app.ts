import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { userRouter } from './routes/userRoutes'
import { dietRouter } from './routes/dietRoutes'

export const app = fastify()

app.register(cookie)

app.register(userRouter, {
  prefix: 'api/v1/users',
})

app.register(dietRouter, {
  prefix: 'api/v1/diets',
})
