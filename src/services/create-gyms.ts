import { Gym } from "@prisma/client"
import { GymsRepository } from "../repositories/gym-repository"

interface CreateGymServiceRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface CreateGymServiceResponse {
  gym: Gym
}

export class CreateGymService {
  constructor(private gymsRepo: GymsRepository) { }

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymServiceRequest): Promise<CreateGymServiceResponse> {

    const gym = await this.gymsRepo.create({
      title,
      description,
      phone,
      latitude,
      longitude
    })

    return {
      gym,
    }
  }
}
