import { Chekin } from "@prisma/client";
import { CheckInsRepository } from "../repositories/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found";
import dayjs from "dayjs";
import { LateCheckinValidationError } from "./errors/late-checkin-validation-error";

interface ValidateCheckInServiceRequest {
  checkInId: string
}

interface ValidateCheckInServiceResponse {
  checkIn: Chekin
}

export class ValidateCheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({ 
    checkInId
  }: ValidateCheckInServiceRequest):Promise<ValidateCheckInServiceResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes'
    )

    if(distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckinValidationError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn
    }
  }
}