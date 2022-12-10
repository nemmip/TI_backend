import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { IsExistingByUuid } from '../../commons/validators/is-existing-by-uuid.validator'
import { IsGroupExists } from '../../commons/validators/is-group-exist.validator'
import { CURRENCY } from '../../commons/enums/currency.enums'

@InputType({ description: 'Input for creating party group' })
export class PartyGroupCreateInput {
	@Field(() => String, { description: 'Name of created group' })
		name: string

	@Field(() => CURRENCY, { description: 'Currency used in created group' })
	@IsEnum(CURRENCY)
	@IsNotEmpty()
		currency: CURRENCY

	ownerUuid: string
}

@InputType({ description: 'Input for deleting party group' })
export class PartyGroupDeleteInput {
	@Field(() => String, { description: 'Uuid of group to delete' })
	@IsGroupExists()
		groupUuid: string
}

@InputType({ description: 'Input for adding user to party group' })
export class PartyGroupAddUserInput {
	@Field(() => String, { description: 'Uuid of user to add' })
	@IsExistingByUuid()
		userUuid: string
}
