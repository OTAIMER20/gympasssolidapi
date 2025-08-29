import { hash } from "bcryptjs"
import { UsersRepo } from "../repositories/users-repo"
import { UserAlreadyExistError } from "./errors/user-already-exist"
import { User } from "@prisma/client"

interface RegisterServiceRequest {
  name: string,
  email: string,
  password: string
}

interface RegisterServiceResponse {
  user: User
}

export class RegisterService {
  constructor(private usersRepo: UsersRepo) {}

  async execute ({
    name,
    email,
    password,
  }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
    const password_hash = await hash(password, 6)
  
    const userWithSameEmail = await this.usersRepo.findByEmail(email)
  
    if (userWithSameEmail) {
      throw new UserAlreadyExistError()
    }
  
    const user = await this.usersRepo.create({
      name,
      email,
      password_hash
    })

    return {
      user,
    }
  }
}
