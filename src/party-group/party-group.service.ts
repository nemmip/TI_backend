import { Injectable } from '@nestjs/common';
import { PartyGroupDao } from './party-group.dao';
import { PartyGroupCreateInput } from './models/party-group.input';
import { UserInputError } from 'apollo-server-express';

@Injectable()
export class PartyGroupService {
  constructor(private readonly dao: PartyGroupDao) {}
  async partyGroupCreate(input: PartyGroupCreateInput) {
    const currentTime = new Date().valueOf().toString();
    const code = currentTime.slice(currentTime.length - 8);

    return await this.dao.createPartyGroup({ ...input, code });
  }

  async partyGroupGetForUser(uuid: string) {
    return await this.dao.getAllForUser(uuid);
  }

  async partyGroupDelete(uuid: string) {
    return await this.dao.deletePartyGroup(uuid);
  }

  async findGroupByCode(code: string) {
    const group = this.dao.findGroupByCode(code);
    if (group) {
      return group;
    }
    throw new UserInputError(`Group with code ${code} not found`);
  }

  async partyGroupMembers(code: string) {
    const group = await this.findGroupByCode(code);

    return await this.dao.getGroupMembers(group.uuid);
  }

  async partyGroupAddUser(code: string, userUuid: string) {
    const group = await this.findGroupByCode(code);

    return await this.dao.addMemberToGroup(group.uuid, userUuid);
  }
}
