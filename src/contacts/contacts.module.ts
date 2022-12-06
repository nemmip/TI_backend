import { Module } from '@nestjs/common'
import { AppPrismaModule } from '../commons/prisma/prisma.module'
import { UsersModule } from '../users/users.module'
import { ContactsDao } from './contacts.dao'
import { ContactsResolver } from './contacts.resolver'
import { ContactsService } from './contacts.service'

@Module({
	imports: [UsersModule, AppPrismaModule],
	providers: [ContactsResolver, ContactsService, ContactsDao],
})
export class ContactsModule {}
