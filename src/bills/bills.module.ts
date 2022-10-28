import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsResolver } from './bills.resolver';
import { BillsDao } from './bills.dao';
import { AppPrismaModule } from 'src/commons/prisma/prisma.module';
import { PartyGroupModule } from 'src/party-group/party-group.module';

@Module({
  imports: [AppPrismaModule, PartyGroupModule],
  providers: [BillsService, BillsResolver, BillsDao],
})
export class BillsModule {}
