import { PrismaGymsRepository } from "../../repositories/prisma/prisma-gyms-repository"
import { SearchGymsService } from "../search-gyms"

export function makeSearchGymsService() {
  const gymsRepo = new PrismaGymsRepository()
  const service = new SearchGymsService(gymsRepo)

  return service
}