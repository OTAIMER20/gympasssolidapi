import { expect, describe, it, beforeEach } from "vitest"
import { InMemoryUsersRepo } from "../repositories/in-memory/in-memory-users-repo"
import { hash } from "bcryptjs"
import { GetUserProfileService } from "./get-user-profile"
import { ResourceNotFoundError } from "./errors/resource-not-found"

let usersRepository: InMemoryUsersRepo
let sut: GetUserProfileService

describe('Get user profile Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepo()
    sut = new GetUserProfileService(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'Gabriel Otaimer',
      email: 'otagab@gmail.com',
      password_hash: await hash('123456', 6)
    })

    const { user } = await sut.execute({
      userId: createdUser.id
    })

    expect(user.name).toEqual('Gabriel Otaimer')
  })

  it('should not be able to get user profile with wrong id', async () => {
    expect(() => sut.execute({
      userId: 'non-existing-id',
    })
  ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
