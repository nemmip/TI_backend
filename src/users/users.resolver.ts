import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GraphQLID } from 'graphql';
import { User } from 'src/commons/decorators/user.decorator';
import { USER_TYPE } from 'src/commons/enums/user.enums';
import { UserType } from 'src/commons/guards/user-type.gurad';
import { UserCreateInput } from './models/users.inputs';
import { UserBaseDataType } from './models/users.models';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  @Query(() => String)
  async dumbQuery() {
    return 'Hello world';
  }

  @Mutation(() => UserBaseDataType)
  async createRegularUser(@Args('input') input: UserCreateInput) {
    return await this.usersService.createRegularUser(input);
  }

  @Mutation(() => GraphQLID)
  @UserType(USER_TYPE.ADMIN)
  async deleteAnyUser(@Args('uuid') uuid: string) {
    return await this.usersService.deleteAnyUser(uuid);
  }

  @Query(() => UserBaseDataType)
  @UserType(USER_TYPE.REGULAR)
  async me(@User() { uuid }: UserBaseDataType) {
    return await this.usersService.getUserByUuid(uuid);
  }
}
