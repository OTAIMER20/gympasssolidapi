import { expect, describe, it, beforeEach } from "vitest"
import { InMemoryGymsRepo } from "../repositories/in-memory/in-memory-gyms-repo"
import { CreateGymService } from "./create-gyms"

let gymsRepo: InMemoryGymsRepo
let sut: CreateGymService

describe('Create Gym Service', () => {
  beforeEach(() => {
    gymsRepo = new InMemoryGymsRepo()
    sut = new CreateGymService(gymsRepo)
  })

  it('should be able to create gym', async () => {

    const { gym } = await sut.execute({
      title: 'Typescript Gym',
      description: '',
      phone: '',
      latitude: -45.8836395,
      longitude: -4.8032745
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
