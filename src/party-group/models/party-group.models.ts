import { Field, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { GraphQLID } from 'graphql';
import { CURRENCY } from 'src/commons/enums/currency.enums';

@ObjectType({ description: 'Represents database type of party group.' })
export class PartyGroup {
  @Field(() => GraphQLID, { description: 'Uuid of created group' })
  uuid: string;

  @Field(() => String, { description: 'Name of the party group' })
  name: string;

  @Field(() => String, { description: 'Invitation code of group' })
  code: String;

  @Field(() => CURRENCY, { description: 'Currency used in party group' })
  currency: CURRENCY;
}
