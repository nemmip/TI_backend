import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsOptional } from 'class-validator';
import { GraphQLID } from 'graphql';
import { USER_TYPE } from 'src/commons/enums/user.enums';

@ObjectType()
export class UserBaseDataType {
  @Field(() => GraphQLID)
  uuid: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => USER_TYPE)
  type: USER_TYPE;

  @Field(() => GraphQLID, { nullable: true })
  @IsOptional()
  groupUuid?: string;

  // TODO: add savedContacts, PartyGroup, payedBills
}
