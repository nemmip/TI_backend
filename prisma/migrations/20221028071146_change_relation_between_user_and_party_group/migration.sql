-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_groupUuid_fkey";

-- CreateTable
CREATE TABLE "_PartyGroupToUser" (
    "A" VARCHAR(36) NOT NULL,
    "B" VARCHAR(36) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PartyGroupToUser_AB_unique" ON "_PartyGroupToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PartyGroupToUser_B_index" ON "_PartyGroupToUser"("B");

-- AddForeignKey
ALTER TABLE "_PartyGroupToUser" ADD CONSTRAINT "_PartyGroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "PartyGroup"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PartyGroupToUser" ADD CONSTRAINT "_PartyGroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
