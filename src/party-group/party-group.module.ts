import { Module } from "@nestjs/common";
import { PartyGroupService } from "./party-group.service";
import { PartyGroupResolver } from "./party-group.resolver";
import { PartyGroupDao } from "./party-group.dao";
import { AppPrismaModule } from "../commons/prisma/prisma.module";
import { BillsModule } from "../bills/bills.module";

@Module({
  imports: [AppPrismaModule, BillsModule],
  providers: [PartyGroupService, PartyGroupResolver, PartyGroupDao],
  exports: [PartyGroupService],
})
export class PartyGroupModule {}
