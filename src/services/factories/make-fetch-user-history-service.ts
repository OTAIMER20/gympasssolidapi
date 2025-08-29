import { PrismaCheckInsRepository } from "../../repositories/prisma/prisma-checkin-repository"
import { FetchUserCheckinHistoryService } from "../fetch-user-checkins-history"

export function makeFetchUserHistoryService() {
  const checkInsRepo = new PrismaCheckInsRepository()
  const service = new FetchUserCheckinHistoryService(checkInsRepo)

  return service
}