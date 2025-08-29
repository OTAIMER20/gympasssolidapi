import { PrismaGymsRepository } from "../../repositories/prisma/prisma-gyms-repository"
import { FetchNearByGymsService } from "../fetch-nearby-gyms"

export function makeFetchNearbyGymsService() {
  const gymsRepo = new PrismaGymsRepository()
  const service = new FetchNearByGymsService(gymsRepo)

  return service
}