import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsUUID } from 'class-validator'
import { IsExistingByEmail } from '../commons/validators/is-existing-by-email.validator'
import { IsExistingByUuid } from '../commons/validators/is-existing-by-uuid.validator'

@InputType()
export class ContactAddInput {
	@Field(() => String, { description: 'Email of new contact to add.' })
	@IsEmail()
	@IsExistingByEmail()
		contactEmail: string
}

@InputType()
export class ContactDeleteInput {
	@Field(() => String, { description: 'Uuid of contact to delete' })
	@IsUUID()
	@IsExistingByUuid()
		contactUuid: string
}
