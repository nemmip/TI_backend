import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	async onModuleInit() {
		await this.$connect()
		if (process.env.NODE_ENV === 'test') {
			try {
				await this.$transaction([
					this.bill.deleteMany(),
					this.partyGroupOnUser.deleteMany(),
					this.user.deleteMany(),
					this.contacts.deleteMany(),
					this.partyGroup.deleteMany(),
				])
			} catch (e) {
				console.log(e)
			}
		}
	}
}
