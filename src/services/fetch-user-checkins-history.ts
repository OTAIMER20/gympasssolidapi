import { Chekin } from "@prisma/client";
import { CheckInsRepository } from "../repositories/check-ins-repository";

interface FetchUserCheckinHistoryServiceRequest {
  userId: string
  page: number
}

interface FetchUserCheckinHistoryServiceResponse {
  checkIns: Chekin[]
}

export class FetchUserCheckinHistoryService {
  constructor(
    private checkInsRepository: CheckInsRepository,
  ) {}

  async execute({ 
    userId,
    page,
  }: FetchUserCheckinHistoryServiceRequest):Promise<FetchUserCheckinHistoryServiceResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId, page)

    return {
      checkIns
    }
  }
}