import { expect, describe, it, beforeEach } from "vitest"
import { RegisterService } from "./register"
import { compare } from "bcryptjs"
import { InMemoryUsersRepo } from "../repositories/in-memory/in-memory-users-repo"
import { UserAlreadyExistError } from "./errors/user-already-exist"

let usersRepository: InMemoryUsersRepo
let sut: RegisterService

describe('Register Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepo()
    sut = new RegisterService(usersRepository)
  })

  it('should be able to register', async () => {

    const { user } = await sut.execute({
      name: 'Otaimer Gabriel',
      email: 'otagab@gmail.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon register', async () => {
    const { user } = await sut.execute({
      name: 'Otaimer Gabriel',
      email: 'otagab@gmail.com',
      password: '123456'
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'otagab@gmail.com'

    await sut.execute({
      name: 'Otaimer Gabriel',
      email,
      password: '123456'
    })

    await expect(() => sut.execute({
      name: 'Otaimer Gabriel',
      email,
      password: '123456'
    })
  ).rejects.toBeInstanceOf(UserAlreadyExistError)

  })
})
