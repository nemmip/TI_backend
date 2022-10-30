import { Field, InputType } from "@nestjs/graphql"
import { IsEnum, IsNotEmpty } from "class-validator"
import { CURRENCY } from "src/commons/enums/currency.enums"

@InputType({ description: "Input for creating party group" })
export class PartyGroupCreateInput {
	@Field(() => String, { description: "Name of created group" })
	name: string

	@Field(() => CURRENCY, { description: "Currency used in created group" })
	@IsEnum(CURRENCY)
	@IsNotEmpty()
	currency: CURRENCY

	ownerUuid: string
}
