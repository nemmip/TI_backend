import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { GraphQLID } from 'graphql'
import { User } from '../commons/decorators/user.decorator'
import { USER_TYPE } from '../commons/enums/user.enums'
import { UserType } from '../commons/guards/user-type.gurad'
import { UserBaseDataType } from '../users/models/users.models'
import { ContactAddInput, ContactDeleteInput } from './contacts.input'
import { ContactsService } from './contacts.service'

@Resolver()
export class ContactsResolver {
	constructor(private readonly concactsService: ContactsService) {}

	@Mutation(() => UserBaseDataType, {
		description: 'Mutation used for fetching logged user contacts.',
	})
	@UserType(USER_TYPE.REGULAR)
	async contactsGetByUser(@User() { uuid }: UserBaseDataType) {
		return await this.concactsService.contactsGetByUser(uuid)
	}

	@Mutation(() => UserBaseDataType)
	@UserType(USER_TYPE.REGULAR)
	async contactAdd(
		@User() { uuid }: UserBaseDataType,
		@Args('input') input: ContactAddInput
	) {
		return await this.concactsService.contactAdd(uuid, input.contactEmail)
	}

	@Mutation(() => GraphQLID)
	@UserType(USER_TYPE.REGULAR)
	async contactDelete(
		@User() { uuid }: UserBaseDataType,
		@Args('input') input: ContactDeleteInput
	) {
		return await this.concactsService.contactDelete(uuid, input.contactUuid)
	}
}
