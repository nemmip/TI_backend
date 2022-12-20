import { Injectable } from '@nestjs/common'
import { UsersDao } from './users.dao'
import { createHash, randomUUID } from 'crypto'
import { USER_TYPE } from '../commons/enums/user.enums'
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

	async getUserByUuid(uuid: string, include?: Prisma.UserInclude) {
		const user = await this.usersDao.findUserByUuid(uuid, include)

		if (!user) {
			throw new Error(`User with uuid: ${uuid} not found!`)
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

	async findManyUsers(uuids: string[], include?: Prisma.UserInclude) {
		return await this.usersDao.findManyUsers(uuids, include)
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

	async deleteUser(uuid: string) {
		await this.usersDao.deleteUser(uuid)
		return uuid
	}
}
