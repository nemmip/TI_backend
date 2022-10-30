import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Group } from 'src/commons/decorators/group.decorator'
import { User } from 'src/commons/decorators/user.decorator'
import { USER_TYPE } from 'src/commons/enums/user.enums'
import { UserType } from 'src/commons/guards/user-type.gurad'
import { UserBaseDataType } from 'src/users/models/users.models'
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
