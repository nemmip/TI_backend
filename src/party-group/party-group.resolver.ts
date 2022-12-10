import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'
import { GraphQLID } from 'graphql'
import { Group } from '../commons/decorators/group.decorator'
import { User } from '../commons/decorators/user.decorator'
import { USER_TYPE } from '../commons/enums/user.enums'
import { UserType } from '../commons/guards/user-type.gurad'
import { UserBaseDataType } from '../users/models/users.models'
import {
	PartyGroupAddUserInput,
	PartyGroupCreateInput,
	PartyGroupDeleteInput,
} from './models/party-group.input'
import {
	PartyGroup,
	PartyGroupSummary,
	SplitSummary,
} from './models/party-group.models'
import { PartyGroupService } from './party-group.service'

@Resolver()
export class PartyGroupResolver {
	constructor(private readonly partyGroupService: PartyGroupService) {}

	@Mutation(() => PartyGroup)
	@UserType(USER_TYPE.REGULAR)
	async partyGroupCreate(
		@User() { uuid }: UserBaseDataType,
		@Args('input') input: PartyGroupCreateInput
	) {
		return await this.partyGroupService.partyGroupCreate({
			...input,
			ownerUuid: uuid,
		})
	}

	@Mutation(() => [PartyGroup])
	@UserType(USER_TYPE.REGULAR)
	async partyGroupGetForUser(@User() { uuid }: UserBaseDataType) {
		return await this.partyGroupService.partyGroupGetForUser(uuid)
	}

	@Mutation(() => GraphQLID)
	@UserType(USER_TYPE.REGULAR)
	async partyGroupDelete(
		@Args('input') input: PartyGroupDeleteInput,
		@User() { uuid }: UserBaseDataType
	) {
		return await this.partyGroupService.partyGroupDelete(input.groupUuid, uuid)
	}

	@Query(() => PartyGroupSummary)
	@UserType(USER_TYPE.REGULAR, USER_TYPE.GUEST)
	async partyGroupSummary(@Group() groupCode: string) {
		return await this.partyGroupService.partyGroupSummary(groupCode)
	}

	@Mutation(() => UserBaseDataType)
	@UserType(USER_TYPE.REGULAR, USER_TYPE.GUEST)
	async partyGroupAddUser(
		@Group() groupCode: string,
		@Args('input') input: PartyGroupAddUserInput
	) {
		return await this.partyGroupService.partyGroupAddUser(
			groupCode,
			input.userUuid
		)
	}

	@Query(() => [SplitSummary])
	@UserType(USER_TYPE.REGULAR, USER_TYPE.GUEST)
	async splitPartyGroup(@Group() groupCode: string) {
		return await this.partyGroupService.splitPartyGroup(groupCode)
	}
}
