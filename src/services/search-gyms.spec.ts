import { expect, describe, it, beforeEach } from "vitest"
import { InMemoryGymsRepo } from "../repositories/in-memory/in-memory-gyms-repo"
import { SearchGymsService } from "./search-gyms"

let gymsRepo: InMemoryGymsRepo
let sut: SearchGymsService

describe('Search Gyms Service', () => {
  beforeEach(async () => {
    gymsRepo = new InMemoryGymsRepo()
    sut = new SearchGymsService(gymsRepo)

  })

  it('should be able to search for gyms', async () => {
    await gymsRepo.create({
      title: 'Typescript Academy',
      description: '',
      phone: '',
      latitude: -45.8836395,
      longitude: -4.8032745
    })

    await gymsRepo.create({
      title: 'Javascript Academy',
      description: '',
      phone: '',
      latitude: -45.8836395,
      longitude: -4.8032745
    })

    const { gyms } = await sut.execute({
      query: 'Typescript',
      page: 1
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Typescript Academy' })
    ])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 23; i++) {
      await gymsRepo.create({
        title: `Typescript Academy ${i}`,
        description: '',
        phone: '',
        latitude: -45.8836395,
        longitude: -4.8032745
      })
    }

    const { gyms } = await sut.execute({
      query: 'Typescript',
      page:2
    })

    expect(gyms).toHaveLength(3)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Typescript Academy 21' }),
      expect.objectContaining({ title: 'Typescript Academy 22' }),
      expect.objectContaining({ title: 'Typescript Academy 23' })
    ])
  })

})
