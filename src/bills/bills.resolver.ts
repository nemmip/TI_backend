import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Group } from '../commons/decorators/group.decorator'
import { User } from '../commons/decorators/user.decorator'
import { USER_TYPE } from '../commons/enums/user.enums'
import { UserType } from '../commons/guards/user-type.gurad'
import { UserBaseDataType } from '../users/models/users.models'
import { BillsService } from './bills.service'
import { BillCreateInput } from './models/bills.input'
import { BillDataBaseType } from './models/bills.model'

@Resolver()
export class BillsResolver {
	constructor(private readonly billsService: BillsService) {}

	@Mutation(() => BillDataBaseType)
	@UserType(USER_TYPE.REGULAR, USER_TYPE.GUEST)
	async billCreate(
		@Group() groupCode: string,
		@User() { uuid }: UserBaseDataType,
		@Args('input') input: BillCreateInput
	) {
		return await this.billsService.billCreate({
			...input,
			groupCode,
			payedBy: uuid,
		})
	}

	@Mutation(() => [BillDataBaseType])
	@UserType(USER_TYPE.REGULAR, USER_TYPE.GUEST)
	async billGetForGroupUser(
		@Group() groupCode: string,
		@User() { uuid }: UserBaseDataType
	) {
		return await this.billsService.billGetForGroupUser(groupCode, uuid)
	}
}
