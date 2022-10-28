import { Args, Mutation, Resolver } from '@nestjs/graphql';
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
}
