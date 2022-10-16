import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GraphQLID } from 'graphql';
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

  // TODO: add guards for admin
  @Mutation(() => GraphQLID)
  async deleteAnyUser(@Args('uuid') uuid: string) {
    return await this.usersService.deleteAnyUser(uuid);
  }
}
