import {
	applyDecorators,
	CanActivate,
	ExecutionContext,
	Injectable,
	SetMetadata,
	UseGuards,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { USER_TYPE } from '../enums/user.enums'
import { GqlAuthGuard } from './gql-auth.guard'

export function UserType(...types: USER_TYPE[]) {
	return applyDecorators(
		SetMetadata('types', types),
		UseGuards(GqlAuthGuard, UserTypeGuard)
	)
}

@Injectable()
class UserTypeGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const types = this.reflector.get<string[]>('types', context.getHandler())
		const ctx = GqlExecutionContext.create(context)
		const { user } = ctx.getContext().req

		return types.indexOf(user.type) >= 0
	}
}
