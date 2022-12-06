import { Field, InputType } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'
import { IsStrongPassword } from '../../commons/decorators/is-strong-password.decorator'

@InputType()
export class UserCreateInput {
	@Field(() => String)
	name: string

	@Field(() => String)
	@IsEmail()
	email: string

	@Field(() => String)
	@IsStrongPassword({
		message:
			'Your password should be between 8-20 characters long and should contain ' +
			'at least one lowercase and uppercase letter, one special character and one digit.',
	})
	password: string
}
