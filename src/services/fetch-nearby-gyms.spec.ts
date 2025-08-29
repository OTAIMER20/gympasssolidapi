import { expect, describe, it, beforeEach } from "vitest"
import { InMemoryGymsRepo } from "../repositories/in-memory/in-memory-gyms-repo"
import { FetchNearByGymsService } from "./fetch-nearby-gyms"


let gymsRepo: InMemoryGymsRepo
let sut: FetchNearByGymsService

describe('Fetch Near By Gyms Service', () => {
  beforeEach(async () => {
    gymsRepo = new InMemoryGymsRepo()
    sut = new FetchNearByGymsService(gymsRepo)

  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepo.create({
      title: 'Typescript Near Academy',
      description: '',
      phone: '',
      latitude: -45.8836395,
      longitude: -4.8032745
    })

    await gymsRepo.create({
      title: 'Javascript Far Academy',
      description: '',
      phone: '',
      latitude: -35.8836395,
      longitude: -6.8032745
    })

    const { gyms } = await sut.execute({
      userLatitude: -45.8836395,
      userLongitude: -4.8032745
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Typescript Near Academy' })
    ])
  })

})
