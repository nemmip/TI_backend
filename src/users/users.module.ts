import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { AppPrismaModule } from 'src/commons/prisma/prisma.module';
import { UsersDao } from './users.dao';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [AppPrismaModule],
  providers: [UsersResolver, UsersService, UsersDao],
  exports: [UsersService],
})
export class UsersModule {}
