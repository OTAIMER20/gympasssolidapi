import { PrismaCheckInsRepository } from "../../repositories/prisma/prisma-checkin-repository"
import { GetUserMetricsService } from "../get-user-metrics"

export function makeGetUserMetricsService() {
  const checkInsRepo = new PrismaCheckInsRepository()
  const service = new GetUserMetricsService(checkInsRepo)

  return service
}