import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthenticationError } from 'apollo-server-express'
import { createHash } from 'crypto'
import { UserWithGroups } from '../users/models/users.interfaces'
import { PartyGroupService } from '../party-group/party-group.service'
import { UsersService } from '../users/users.service'
import { GroupLoginInput } from './models/auth.input'

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		private partyGroupService: PartyGroupService
	) {}

	async validateUser(email: string, password: string): Promise<any> {
		const user = await this.usersService.getUserByEmail(email)
		const checkHash = await this.check(user.password, password)
		if (user && checkHash) {
			// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
			const { password, ...result } = user
			return result
		}
		throw new AuthenticationError('Wrong password.')
	}

	private async check(digest: string, plaintext: string): Promise<boolean> {
		const hash = createHash(process.env.HASHING_ALG)
			.update(plaintext)
			.digest('base64')
		return digest === hash
	}

	async login(user: any) {
		const payload = user
		return this.jwtService.sign(payload)
	}

	async refreshToken(token: string) {
		const { uuid, name, email, type, groupUuid } = this.jwtService.decode(
			token
		) as any
		return this.jwtService.sign({ uuid, name, email, type, groupUuid })
	}

	async validateGroup(input: GroupLoginInput) {
		const group = await this.partyGroupService.findGroupByCode(input.code)

		if (input.uuid) {
			const user = (await this.usersService.getUserByUuid(input.uuid, {
				groups: true,
			})) as UserWithGroups
			const isInGroup = user.groups.find((ug) => ug.uuid === group.uuid)
			if (!isInGroup) {
				await this.usersService.updateUser({
					where: { uuid: user.uuid },
					data: {
						groups: { create: { groupUuid: group.uuid } },
					},
				})
			}
			return {
				uuid: user.uuid,
				email: user.email,
				type: user.type,
				groupCode: group.code,
			}
		}
		const user = await this.usersService.createGuestUser(input.name, group.uuid)
		return {
			uuid: user.uuid,
			email: user.email,
			type: user.type,
			groupCode: group.code,
		}
	}
}
