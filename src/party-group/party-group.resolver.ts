import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GraphQLID } from 'graphql';
import { Group } from 'src/commons/decorators/group.decorator';
import { User } from 'src/commons/decorators/user.decorator';
import { USER_TYPE } from 'src/commons/enums/user.enums';
import { UserType } from 'src/commons/guards/user-type.gurad';
import { UserBaseDataType } from 'src/users/models/users.models';
import { PartyGroupCreateInput } from './models/party-group.input';
import { PartyGroup } from './models/party-group.models';
import { PartyGroupService } from './party-group.service';

@Resolver()
export class PartyGroupResolver {
  constructor(private readonly partyGroupService: PartyGroupService) {}

  @Mutation(() => PartyGroup)
  @UserType(USER_TYPE.REGULAR)
  async partyGroupCreate(
    @User() { uuid }: UserBaseDataType,
    @Args('input') input: PartyGroupCreateInput,
  ) {
    return await this.partyGroupService.partyGroupCreate({
      ...input,
      ownerUuid: uuid,
    });
  }

  @Mutation(() => [PartyGroup])
  @UserType(USER_TYPE.REGULAR)
  async partyGroupGetForUser(@User() { uuid }: UserBaseDataType) {
    return await this.partyGroupService.partyGroupGetForUser(uuid);
  }

  @Mutation(() => GraphQLID)
  @UserType(USER_TYPE.REGULAR)
  async partyGroupDelete(
    @Args('input', { description: 'Uuid of group to delete' }) input: string,
  ) {
    return await this.partyGroupService.partyGroupDelete(input);
  }

  @Query(() => PartyGroup)
  @UserType(USER_TYPE.REGULAR, USER_TYPE.GUEST)
  async partyGroupDetails(@Group() groupCode: string) {
    return await this.partyGroupService.findGroupByCode(groupCode);
  }

  @Mutation(() => [UserBaseDataType])
  @UserType(USER_TYPE.REGULAR, USER_TYPE.GUEST)
  async partyGroupMembers(@Group() groupCode: string) {
    return await this.partyGroupService.partyGroupMembers(groupCode);
  }

  @Mutation(() => UserBaseDataType)
  @UserType(USER_TYPE.REGULAR, USER_TYPE.GUEST)
  async partGroupAddUser(
    @Group() groupCode: string,
    @Args('input', { description: 'Uuid of user to add' }) input: string,
  ) {
    return await this.partyGroupService.partyGroupAddUser(groupCode, input);
  }
}
