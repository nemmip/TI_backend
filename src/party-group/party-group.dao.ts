import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/commons/prisma/prisma.service';
import { PartyGroupCreateArgs } from './models/party-group.interfaces';

@Injectable()
export class PartyGroupDao {
  constructor(private readonly db: PrismaService) {}

  async createPartyGroup(input: PartyGroupCreateArgs) {
    return await this.db.partyGroup.create({
      data: {
        name: input.name,
        code: input.code,
        currency: input.currency,
        group: {
          create: { user: { connect: { uuid: input.ownerUuid } } },
        },
      },
    });
  }
}
