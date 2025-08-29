import { Chekin } from "@prisma/client";
import { CheckInsRepository } from "../repositories/check-ins-repository";
import { GymsRepository } from "../repositories/gym-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found";
import { getDistanceInKm } from "../utils/get-distance";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckinError } from "./errors/max-numver-of-chekin-error";

interface CheckInServiceRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInServiceResponse {
  checkIn: Chekin
}

export class CheckInService {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({ 
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInServiceRequest):Promise<CheckInServiceResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceInKm(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
    )

    const MAX_DISTANCE_KM = 0.1

    if (distance > MAX_DISTANCE_KM) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    )

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckinError()
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId
    })

    return {
      checkIn
    }
  }
}