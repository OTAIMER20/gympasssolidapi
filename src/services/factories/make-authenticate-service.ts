import { PrismaUsersRepo } from "../../repositories/prisma/prisma-users-repo"
import { AuthenticateService } from "../authenticate"

export function makeAuthenticateService() {
  const prismaUsersRepo = new PrismaUsersRepo()
  const authenticateService = new AuthenticateService(prismaUsersRepo)

  return authenticateService
}