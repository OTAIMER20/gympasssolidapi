import { Chekin, Prisma } from "@prisma/client";

export interface CheckInsRepository {
  create(data: Prisma.ChekinUncheckedCreateInput): Promise<Chekin>
  save(checkIn: Chekin): Promise<Chekin>
  findById(id: string): Promise<Chekin | null>
  findManyByUserId(userId: string, page: number): Promise<Chekin[]>
  findByUserIdOnDate(userId: string, date: Date): Promise<Chekin | null>
  countByUserId(userId: string): Promise<number>
}