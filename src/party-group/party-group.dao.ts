import { Injectable } from "@nestjs/common";
import { PrismaService } from "../commons/prisma/prisma.service";
import { PartyGroupCreateArgs } from "./models/party-group.interfaces";

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

  async getAllForUser(userUuid: string) {
    const groups = await this.db.partyGroupOnUser.findMany({
      where: { userUuid },
    });

    const groupsPromises = groups.map((g) =>
      this.db.partyGroup.findUnique({ where: { uuid: g.groupUuid } })
    );
    return Promise.all(groupsPromises);
  }

  async deletePartyGroup(uuid: string, userUuid: string) {
    await this.db.partyGroupOnUser.delete({
      where: { groupUuid_userUuid: { groupUuid: uuid, userUuid } },
    });
    return uuid;
  }

  async findGroupByCode(code: string) {
    return await this.db.partyGroup.findUnique({ where: { code } });
  }

  async getGroupMembers(uuid: string) {
    const partyGroupOnUser = await this.db.partyGroupOnUser.findMany({
      where: { groupUuid: uuid },
      include: { user: true },
    });

    return partyGroupOnUser.map((partyGroup) => partyGroup.user);
  }

  async addMemberToGroup(groupUuid: string, userUuid: string) {
    const connection = await this.db.partyGroupOnUser.upsert({
      where: {
        groupUuid_userUuid: {
          groupUuid,
          userUuid,
        },
      },
      create: {
        partyGroup: { connect: { uuid: groupUuid } },
        user: { connect: { uuid: userUuid } },
      },
      update: {},
      include: { user: true },
    });
    const user = await this.db.user.findUnique({
      where: { uuid: connection.user.uuid },
      include: { payedBills: true },
    });
    return user;
  }
}
