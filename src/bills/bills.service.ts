import { Injectable } from '@nestjs/common';
import { PartyGroupService } from 'src/party-group/party-group.service';
import { BillsDao } from './bills.dao';
import { BillCreateInput } from './models/bills.input';

@Injectable()
export class BillsService {
  constructor(
    private readonly dao: BillsDao,
    private readonly groupsService: PartyGroupService,
  ) {}

  async billCreate(input: BillCreateInput) {
    const group = await this.groupsService.findGroupByCode(input.groupCode);
    return await this.dao.create({
      name: input.name,
      price: input.price,
      Payer: { connect: { uuid: input.payedBy } },
      Group: { connect: { uuid: group.uuid } },
    });
  }
}