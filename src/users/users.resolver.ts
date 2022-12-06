import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { User } from '../commons/decorators/user.decorator'
import { USER_TYPE } from '../commons/enums/user.enums'
import { UserType } from '../commons/guards/user-type.gurad'
import { UserCreateInput } from './models/users.inputs'
import { UserBaseDataType } from './models/users.models'
import { UsersService } from './users.service'

@Resolver()
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	@Mutation(() => UserBaseDataType)
	async createRegularUser(@Args('input') input: UserCreateInput) {
		return await this.usersService.createRegularUser(input)
	}

	@Query(() => UserBaseDataType)
	@UserType(USER_TYPE.REGULAR)
	async me(@User() { uuid }: UserBaseDataType) {
		return await this.usersService.getUserByUuid(uuid)
	}
}
