import { UsersRepo } from "../repositories/users-repo"
import { User } from "@prisma/client"
import { ResourceNotFoundError } from "./errors/resource-not-found"

interface GetUserProfileServiceRequest {
  userId: string
}

interface GetUserProfileServiceResponse {
  user: User
}

export class GetUserProfileService {
  constructor(
    private userRepo: UsersRepo,
  ) { }

  async execute({
    userId
  }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
    const user = await this.userRepo.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user
    }
  }
}
