import { Gym } from "@prisma/client"
import { GymsRepository } from "../repositories/gym-repository"

interface SearchGymsServiceRequest {
  query: string
  page: number
}

interface SearchGymsServiceResponse {
  gyms: Gym[]
}

export class SearchGymsService {
  constructor(private gymsRepo: GymsRepository) { }

  async execute({
    query,
    page
  }: SearchGymsServiceRequest): Promise<SearchGymsServiceResponse> {

    const gyms = await this.gymsRepo.searchMany(query, page)

    return {
      gyms,
    }
  }
}
