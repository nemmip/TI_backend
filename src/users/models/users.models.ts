import { Field, ObjectType } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'
import { GraphQLID } from 'graphql'
import { BillDataBaseType } from '../../bills/models/bills.model'
import { USER_TYPE } from '../../commons/enums/user.enums'
import { Contact } from '../../contacts/contacts.models'
import { PartyGroup } from '../../party-group/models/party-group.models'

@ObjectType()
export class UserBaseDataType {
	@Field(() => GraphQLID)
	uuid: string

	@Field(() => String)
	name: string

	@Field(() => String)
	@IsEmail()
	email: string

	@Field(() => USER_TYPE)
	type: USER_TYPE

	@Field(() => [Contact], {
		description: 'Saved contacts for specific user',
		nullable: true,
	})
	savedContacts?: Contact[]

	@Field(() => [PartyGroup], {
		description: 'Saved groups for specific user',
		nullable: true,
	})
	groups?: PartyGroup[]

	@Field(() => [BillDataBaseType], {
		description: 'Saved bills for specific user',
		nullable: true,
	})
	payedBills?: BillDataBaseType[]
}
