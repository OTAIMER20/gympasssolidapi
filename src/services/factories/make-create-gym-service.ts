import { PrismaGymsRepository } from "../../repositories/prisma/prisma-gyms-repository"
import { CreateGymService } from "../create-gyms"

export function makeCreateGymService() {
  const gymsRepo = new PrismaGymsRepository()
  const service = new CreateGymService(gymsRepo)

  return service
}