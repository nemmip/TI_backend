-- DropForeignKey
ALTER TABLE "PartyGroupOnUser" DROP CONSTRAINT "PartyGroupOnUser_groupUuid_fkey";

-- AddForeignKey
ALTER TABLE "PartyGroupOnUser" ADD CONSTRAINT "PartyGroupOnUser_groupUuid_fkey" FOREIGN KEY ("groupUuid") REFERENCES "PartyGroup"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
