import { Module } from '@nestjs/common';
import { AppGraphQLModule } from './commons/graphql/graphql.module';
import { AppPrismaModule } from './commons/prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AppGraphQLModule, AppPrismaModule, UsersModule],
})
export class AppModule {}
