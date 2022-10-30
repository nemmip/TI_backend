import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { AuthLoginInput, GroupLoginInput } from './models/auth.input'

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}
	@Mutation(() => String)
	async createLoginSession(@Args('input') input: AuthLoginInput) {
		const user = await this.authService.validateUser(
			input.email,
			input.password
		)
		return await this.authService.login(user)
	}

	@Mutation(() => String)
	async refreshLoginSession(
		@Args('input', { description: 'Token to refresh' }) input: string
	) {
		return await this.authService.refreshToken(input)
	}

	@Mutation(() => String)
	async createGroupSession(@Args('input') input: GroupLoginInput) {
		const userWithGroup = await this.authService.validateGroup(input)
		return await this.authService.login(userWithGroup)
	}
}
