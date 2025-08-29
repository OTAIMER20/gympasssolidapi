import { PrismaUsersRepo } from "../../repositories/prisma/prisma-users-repo"
import { GetUserProfileService } from "../get-user-profile"

export function makeGetUserProfileService() {
  const prismaUsersRepo = new PrismaUsersRepo()
  const service = new GetUserProfileService(prismaUsersRepo)

  return service
}