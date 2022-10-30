import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/commons/prisma/prisma.service'

@Injectable()
export class BillsDao {
	constructor(private readonly db: PrismaService) {}

	async create(input: Prisma.BillCreateInput) {
		return await this.db.bill.create({ data: input })
	}

	async findByGroupUser(groupUuid: string, userUuid: string) {
		return await this.db.bill.findMany({
			where: {
				groupUuid,
				payedBy: userUuid,
			},
		})
	}
}
