import { Injectable } from '@nestjs/common'
import { PrismaService } from '../commons/prisma/prisma.service'

@Injectable()
export class ContactsDao {
	constructor(private readonly db: PrismaService) {}

	async removeContact(userUuid: string, uuidToRemove: string) {
		return await this.db.contacts.delete({
			where: {
				uuid_contactUuid: {
					uuid: uuidToRemove,
					contactUuid: userUuid,
				},
			},
		})
	}
}
