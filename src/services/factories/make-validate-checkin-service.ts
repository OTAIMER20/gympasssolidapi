import { PrismaCheckInsRepository } from "../../repositories/prisma/prisma-checkin-repository"
import { ValidateCheckInService } from "../validate-checkin"

export function makeValidateCheckinService() {
  const checkInsRepo = new PrismaCheckInsRepository()
  const service = new ValidateCheckInService(checkInsRepo)

  return service
}