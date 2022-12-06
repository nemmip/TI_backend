import { forwardRef, Module } from "@nestjs/common";
import { BillsService } from "./bills.service";
import { BillsResolver } from "./bills.resolver";
import { BillsDao } from "./bills.dao";
import { AppPrismaModule } from "../commons/prisma/prisma.module";
import { PartyGroupModule } from "../party-group/party-group.module";

@Module({
  imports: [AppPrismaModule, forwardRef(() => PartyGroupModule)],
  providers: [BillsService, BillsResolver, BillsDao],
  exports: [BillsService],
})
export class BillsModule {}
