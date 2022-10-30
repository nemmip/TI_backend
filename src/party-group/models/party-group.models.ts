import { Field, Float, ObjectType } from '@nestjs/graphql'
import { GraphQLID } from 'graphql'
import { CURRENCY } from 'src/commons/enums/currency.enums'
import { UserBaseDataType } from 'src/users/models/users.models'

@ObjectType({ description: 'Represents database type of party group.' })
export class PartyGroup {
	@Field(() => GraphQLID, { description: 'Uuid of created group' })
	uuid: string

	@Field(() => String, { description: 'Name of the party group' })
	name: string

	@Field(() => String, { description: 'Invitation code of group' })
	code: string

	@Field(() => CURRENCY, { description: 'Currency used in party group' })
	currency: CURRENCY
}

@ObjectType()
export class BillSummary {
	@Field(() => UserBaseDataType)
	member: UserBaseDataType

	@Field()
	sumOfBills: number
}

@ObjectType()
export class PartyGroupSummary {
	@Field(() => PartyGroup)
	group: PartyGroup

	@Field(() => [BillSummary])
	billsSummary: BillSummary
}

@ObjectType()
export class SplitSummary {
	@Field(() => String)
	name: string

	@Field(() => Float)
	pay: number
}
