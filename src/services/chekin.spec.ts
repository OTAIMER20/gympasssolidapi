import { expect, describe, it, beforeEach, vi, afterEach } from "vitest"
import { InMemoryCheckInsRepo } from "../repositories/in-memory/in-memory-chekins-repo"
import { CheckInService } from "./chekin"
import { InMemoryGymsRepo } from "../repositories/in-memory/in-memory-gyms-repo"
import { Decimal } from "@prisma/client/runtime/library"
import { MaxDistanceError } from "./errors/max-distance-error"
import { MaxNumberOfCheckinError } from "./errors/max-numver-of-chekin-error"

let checkInsRepository: InMemoryCheckInsRepo
let gymsRepository: InMemoryGymsRepo
let sut: CheckInService

describe('CheckIn Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepo()
    gymsRepository = new InMemoryGymsRepo()
    sut = new CheckInService(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Typescript Gym',
      description: '',
      phone: '',
      latitude: 0,
      longitude: 0
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 7, 25, 9, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0
    })

    await expect(() => sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0
    }),
  ).rejects.toBeInstanceOf(MaxNumberOfCheckinError)
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2025, 7, 25, 9, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0
    })

    vi.setSystemTime(new Date(2025, 7, 26, 9, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Typescript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-45.8836395),
      longitude: new Decimal(-4.8032745)
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -45.886104,
        userLongitude: -4.8005844
      })
    ).rejects.toBeInstanceOf(MaxDistanceError)

  })

})

// -45.886104, -4.8005844,16
// -45.8836395, -4.8032745,16