import { expect, describe, it, beforeEach, vi, afterEach } from "vitest"
import { InMemoryCheckInsRepo } from "../repositories/in-memory/in-memory-chekins-repo"
import { ValidateCheckInService } from "./validate-checkin"
import { ResourceNotFoundError } from "./errors/resource-not-found"
import { LateCheckinValidationError } from "./errors/late-checkin-validation-error"

let checkInsRepository: InMemoryCheckInsRepo
let sut: ValidateCheckInService

describe('Validate CheckIn Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepo()
    sut = new ValidateCheckInService(checkInsRepository)


     vi.useFakeTimers()
  })

  afterEach(() => {
     vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01'
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id
    })

    if(!checkInsRepository.items[0]) {
      throw new ResourceNotFoundError()
    }
    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() => 
    sut.execute({
      checkInId: 'inexistent-check-in-id'
    })
  ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('Should not be able to validate the check-in after 20min of its creation', async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01'
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() => sut.execute({
      checkInId: createdCheckIn.id
    })).rejects.toBeInstanceOf(LateCheckinValidationError)
  })

})
