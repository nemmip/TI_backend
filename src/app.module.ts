import { Module } from '@nestjs/common';
import { AppGraphQLModule } from './commons/graphql/graphql.module';
import { AppPrismaModule } from './commons/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';

@Module({
  imports: [AppGraphQLModule, AppPrismaModule, UsersModule, AuthModule, ContactsModule],
})
export class AppModule {}
