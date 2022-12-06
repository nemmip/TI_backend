import { Field, Float, ObjectType } from '@nestjs/graphql'
import { GraphQLID } from 'graphql'

@ObjectType()
export class BillDataBaseType {
	@Field(() => GraphQLID)
	  uuid: string

	@Field(() => String)
	  name: string

	@Field(() => Float)
	  price: number

	@Field(() => GraphQLID)
	  payedBy: string

	@Field(() => GraphQLID)
	  groupUuid: string
}
