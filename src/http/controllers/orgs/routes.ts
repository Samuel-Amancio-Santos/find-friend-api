import { FastifyInstance } from 'fastify'
import { registerOrg } from './register-org'
import { authenticate } from './authenticateOrgs'
import { create } from './create'
import { refresh } from './refresh'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-org-role'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/orgs', registerOrg)
  app.post('/sessions', authenticate)
  app.patch('/token/refresh', refresh)

  //   Authenticate
  app.post(
    '/create',
    { onRequest: [verifyJwt, verifyUserRole('ADMIN')] },
    create,
  )
}
