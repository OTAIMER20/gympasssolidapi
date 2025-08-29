import { expect, describe, it, beforeEach } from "vitest"
import { InMemoryCheckInsRepo } from "../repositories/in-memory/in-memory-chekins-repo"
import { GetUserMetricsService } from "./get-user-metrics"

let checkInsRepository: InMemoryCheckInsRepo
let sut: GetUserMetricsService

describe('Get User Metrics Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepo()
    sut = new GetUserMetricsService(checkInsRepository)

  })

  it('should be able to get checkin count from metrics', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01'
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01'
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })

})
