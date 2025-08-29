import { PrismaCheckInsRepository } from "../../repositories/prisma/prisma-checkin-repository"
import { PrismaGymsRepository } from "../../repositories/prisma/prisma-gyms-repository"
import { CheckInService } from "../chekin"

export function makeCheckinService() {
  const checkInsRepo = new PrismaCheckInsRepository()
  const gymsRepo = new PrismaGymsRepository()
  
  const service = new CheckInService(checkInsRepo, gymsRepo)

  return service
}