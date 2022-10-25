import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/commons/prisma/prisma.service';

@Injectable()
export class ContactsDao {
  constructor(private readonly db: PrismaService) {}
  async contactsGetByUser(uuid: string) {
    return await this.db.contacts.findMany({
      where: {
        contactUuid: uuid,
      },
    });
  }

  async removeContact(contactUuid: string, uuidToRemove: string) {
    return await this.db.contacts.delete({
      where: {
        uuid_contactUuid: {
          uuid: uuidToRemove,
          contactUuid,
        },
      },
    });
  }
}
