import { Field, Float, InputType } from "@nestjs/graphql"

@InputType()
export class BillCreateInput {
	@Field(() => String)
	name: string

	@Field(() => Float)
	price: number

	groupCode: string
	payedBy: string
}
