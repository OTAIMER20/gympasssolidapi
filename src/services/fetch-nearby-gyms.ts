import { Gym } from "@prisma/client"
import { GymsRepository } from "../repositories/gym-repository"

interface FetchNearByGymsServiceRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchNearByGymsServiceResponse {
  gyms: Gym[]
}

export class FetchNearByGymsService {
  constructor(private gymsRepo: GymsRepository) { }

  async execute({
    userLatitude,
    userLongitude
  }: FetchNearByGymsServiceRequest): Promise<FetchNearByGymsServiceResponse> {

    const gyms = await this.gymsRepo.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude
    })

    return {
      gyms,
    }
  }
}
