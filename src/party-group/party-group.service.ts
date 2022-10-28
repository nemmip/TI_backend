import { Injectable } from '@nestjs/common';
import { PartyGroupDao } from './party-group.dao';
import { PartyGroupCreateInput } from './models/party-group.input';

@Injectable()
export class PartyGroupService {
  constructor(private readonly dao: PartyGroupDao) {}
  async partyGroupCreate(input: PartyGroupCreateInput) {
    const currentTime = new Date().valueOf().toString();
    const code = currentTime.slice(currentTime.length - 8);

    return await this.dao.createPartyGroup({ ...input, code });
  }
}
