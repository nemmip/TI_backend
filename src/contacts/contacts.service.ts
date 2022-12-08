import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { UsersService } from '../users/users.service'
import { ContactsDao } from './contacts.dao'

@Injectable()
export class ContactsService {
	constructor(
		private readonly usersService: UsersService,
		private readonly contactsDao: ContactsDao
	) {}

	async contactsGetByUser(uuid: string) {
		const user = await this.usersService.getUserByUuid(uuid, {
			savedContacts: true,
		})
		return user
	}

	async contactAdd(contactUuid: string, email: string) {
		const newContact = await this.usersService.getUserByEmail(email)
		const user = await this.usersService.getUserByUuid(contactUuid)

		const updateInput: Prisma.UserUpdateArgs = {
			where: { uuid: contactUuid },
			data: {
				...user,
				savedContacts: {
					create: {
						uuid: newContact.uuid,
					},
				},
				groups: undefined,
			},
			include: { savedContacts: true },
		}
		return await this.usersService.updateUser(updateInput)
	}

	async contactDelete(contactUuid: string, uuid: string) {
		const user = await this.usersService.getUserByUuid(contactUuid)

		const updateInput: Prisma.UserUpdateArgs = {
			where: { uuid: contactUuid },
			data: {
				...user,
				savedContacts: {
					delete: {
						uuid_contactUuid: {
							contactUuid,
							uuid,
						},
					},
				},
				groups: undefined,
			},
			include: { savedContacts: true },
		}

		await this.usersService.updateUser(updateInput)
		return uuid
	}
}
