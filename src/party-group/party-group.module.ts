import { Module } from '@nestjs/common';
import { PartyGroupService } from './party-group.service';
import { PartyGroupResolver } from './party-group.resolver';
import { PartyGroupDao } from './party-group.dao';
import { AppPrismaModule } from 'src/commons/prisma/prisma.module';

@Module({
  imports: [AppPrismaModule],
  providers: [PartyGroupService, PartyGroupResolver, PartyGroupDao],
  exports: [PartyGroupService],
})
export class PartyGroupModule {}
