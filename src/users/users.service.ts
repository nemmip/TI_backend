import { Injectable } from '@nestjs/common'
import { UsersDao } from './users.dao'
import { createHash, randomUUID } from 'crypto'
import { USER_TYPE } from 'src/commons/enums/user.enums'
import { UserCreateInput } from './models/users.inputs'
import { Prisma } from '@prisma/client'

@Injectable()
export class UsersService {
	constructor(private readonly usersDao: UsersDao) {}

	async createRegularUser(input: UserCreateInput) {
		const hash = createHash(process.env.HASHING_ALG)
			.update(input.password)
			.digest('base64')

		return await this.usersDao.createUser({
			...input,
			password: hash,
			type: USER_TYPE.REGULAR,
		})
	}

	async deleteAnyUser(uuid: string) {
		await this.getUserByUuid(uuid)
		await this.usersDao.deleteUserByUuid(uuid)
		return uuid
	}

	async getUserByUuid(uuid: string) {
		const user = await this.usersDao.findUserByUuid(uuid)

		if (!user) {
			throw new Error(`User with uuid: ${uuid} not found!.`)
		}

		return user
	}

	async getUserByEmail(email: string) {
		const user = await this.usersDao.findUserByEmail(email)

		if (!user) {
			throw new Error(`User with email: ${email} not found!.`)
		}

		return user
	}

	findManyUsers(uuids: string[]) {
		return this.usersDao.findManyUsers(uuids)
	}

	async updateUser(input: Prisma.UserUpdateArgs) {
		return await this.usersDao.updateUser(input)
	}

	async createGuestUser(name: string, groupUuid: string) {
		return await this.usersDao.createUser({
			name,
			email: randomUUID(),
			password: randomUUID(),
			type: USER_TYPE.GUEST,
			groupUuid,
		})
	}
}
