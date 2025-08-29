import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeFetchUserHistoryService } from "../../../services/factories/make-fetch-user-history-service"

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkinHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1)
  })

  const { page } = checkinHistoryQuerySchema.parse(request.query)

  const fetchUserHistoryService = makeFetchUserHistoryService()

  const { checkIns } = await fetchUserHistoryService.execute({
    userId: request.user.sub,
    page
  })

  return reply.status(200).send({
    checkIns,
  })
}
