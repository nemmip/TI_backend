import { Module } from '@nestjs/common'
import { AppGraphQLModule } from './commons/graphql/graphql.module'
import { AppPrismaModule } from './commons/prisma/prisma.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { ContactsModule } from './contacts/contacts.module'
import { PartyGroupModule } from './party-group/party-group.module'
import { BillsModule } from './bills/bills.module'
import { LoggerModule } from './logger/logger.module';
import { PrintModule } from './print/print.module';

@Module({
	imports: [
		AppGraphQLModule,
		AppPrismaModule,
		UsersModule,
		AuthModule,
		ContactsModule,
		PartyGroupModule,
		BillsModule,
		LoggerModule,
		PrintModule,
	],
})
export class AppModule {}
