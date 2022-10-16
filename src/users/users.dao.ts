import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/commons/prisma/prisma.service';
import { UserCreateArgs } from './models/users.interfaces';

@Injectable()
export class UsersDao {
  constructor(private readonly db: PrismaService) {}
  async createUser(input: UserCreateArgs) {
    const user = await this.db.user.create({ data: { ...input } });
    const dbUser = {
      uuid: user.uuid,
      email: user.email,
      type: user.type,
      groupUuid: user.groupUuid,
    };
    return dbUser;
  }

  async findUserByUuid(uuid: string) {
    return await this.db.user.findUnique({ where: { uuid } });
  }

  async deleteUserByUuid(uuid: string) {
    await this.db.user.delete({ where: { uuid } });
  }
}
