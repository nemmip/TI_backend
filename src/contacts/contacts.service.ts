import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApolloError } from 'apollo-server-express';
import { UsersService } from 'src/users/users.service';
import { ContactsDao } from './contacts.dao';

const logger = new Logger('ContactsService');
@Injectable()
export class ContactsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly contactsDao: ContactsDao,
  ) {}

  async contactsGetByUser(uuid: string) {
    await this.usersService.getUserByUuid(uuid);

    const contacts = await this.contactsDao.contactsGetByUser(uuid);
    const contactsUuids = contacts.map((c) => c.uuid);
    const users = await this.usersService.findManyUsers(contactsUuids);

    const filtered = users.filter(async (u, i) => {
      if (!u) {
        logger.warn(
          `User with uuid: ${contactsUuids[i]} does not exist, deleting...`,
        );
        await this.contactsDao.removeContact(uuid, contactsUuids[i]);
      }
      return !!u;
    });

    return await Promise.all(filtered);
  }

  async contactAdd(contactUuid: string, email: string) {
    const newContact = await this.usersService.getUserByEmail(email);
    const user = await this.usersService.getUserByUuid(contactUuid);

    const updateInput: Prisma.UserUpdateArgs = {
      where: { uuid: contactUuid },
      data: {
        ...user,
        savedContacts: {
          connectOrCreate: {
            where: {
              uuid_contactUuid: {
                uuid: newContact.uuid,
                contactUuid,
              },
            },
            create: {
              uuid: newContact.uuid,
            },
          },
        },
      },
      include: { savedContacts: true },
    };
    return await this.usersService.updateUser(updateInput);
  }

  async contactDelete(contactUuid: string, uuid: string) {
    const user = await this.usersService.getUserByUuid(contactUuid);

    const updateInput: Prisma.UserUpdateArgs = {
      where: { uuid: contactUuid },
      data: {
        ...user,
        savedContacts: {
          delete: {
            uuid_contactUuid: {
              contactUuid,
              uuid,
            },
          },
        },
      },
      include: { savedContacts: true },
    };

    await this.usersService.updateUser(updateInput);
    return uuid;
  }
}
