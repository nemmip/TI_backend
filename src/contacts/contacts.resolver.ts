import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLID } from 'graphql';
import { User } from 'src/commons/decorators/user.decorator';
import { USER_TYPE } from 'src/commons/enums/user.enums';
import { UserType } from 'src/commons/guards/user-type.gurad';
import { UserBaseDataType } from 'src/users/models/users.models';
import { ContactsService } from './contacts.service';

@Resolver()
export class ContactsResolver {
  constructor(private readonly concactsService: ContactsService) {}

  @Mutation(() => [UserBaseDataType], {
    description: 'Mutation used for fetching logged user contacts.',
  })
  @UserType(USER_TYPE.REGULAR)
  async contactsGetByUser(@User() { uuid }: UserBaseDataType) {
    return await this.concactsService.contactsGetByUser(uuid);
  }

  @Mutation(() => UserBaseDataType)
  @UserType(USER_TYPE.REGULAR)
  async contactAdd(
    @User() { uuid }: UserBaseDataType,
    @Args('input', { description: 'Email of new contact' }) input: string,
  ) {
    return await this.concactsService.contactAdd(uuid, input);
  }

  @Mutation(() => GraphQLID)
  @UserType(USER_TYPE.REGULAR)
  async contactDelete(
    @User() { uuid }: UserBaseDataType,
    @Args('input') input: string,
  ) {
    return await this.concactsService.contactDelete(uuid, input);
  }
}
