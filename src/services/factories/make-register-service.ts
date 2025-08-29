import { PrismaUsersRepo } from "../../repositories/prisma/prisma-users-repo"
import { RegisterService } from "../register"

export function makeRegisterService() {
  const prismaUsersRepo = new PrismaUsersRepo()
  const registerService = new RegisterService(prismaUsersRepo)

  return registerService
}