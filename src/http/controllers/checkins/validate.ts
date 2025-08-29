import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeValidateCheckinService } from "../../../services/factories/make-validate-checkin-service"

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckinParamsSchema = z.object({
    checkInId: z.string().uuid()
  })

  const { checkInId } = validateCheckinParamsSchema.parse(request.params)

  const validateCheckinService = makeValidateCheckinService()

  await validateCheckinService.execute({
    checkInId
  })

  return reply.status(204).send()
}
