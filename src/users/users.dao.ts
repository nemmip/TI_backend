import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../commons/prisma/prisma.service'
import { UserCreateArgs } from './models/users.interfaces'

@Injectable()
export class UsersDao {
	constructor(private readonly db: PrismaService) {}
	async createUser(input: UserCreateArgs) {
		const user = await this.db.user.create({
			data: {
				name: input.name,
				email: input.email,
				password: input.password,
				type: input.type,
				groups: input.groupUuid
					? { create: { groupUuid: input.groupUuid } }
					: undefined,
			},
		})
		const dbUser = {
			uuid: user.uuid,
			name: user.name,
			email: user.email,
			type: user.type,
		}
		return dbUser
	}

	async findUserByUuid(uuid: string, include?: Prisma.UserInclude) {
		return await this.db.user.findUnique({
			where: { uuid },
			include,
		})
	}

	async findUserByEmail(email: string) {
		return await this.db.user.findUnique({ where: { email } })
	}

	async findManyUsers(uuids: string[], include?: Prisma.UserInclude) {
		const users = uuids.map(
			async (uuid) =>
				await this.db.user.findUnique({
					where: {
						uuid,
					},
					include,
				})
		)

		return await Promise.all(users)
	}

	async updateUser(input: Prisma.UserUpdateArgs) {
		return await this.db.user.update(input)
	}

	async deleteUser(uuid: string) {
		return await this.db.user.delete({ where: { uuid } })
	}
}
