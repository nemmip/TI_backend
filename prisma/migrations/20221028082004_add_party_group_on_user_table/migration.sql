/*
  Warnings:

  - You are about to drop the column `groupUuid` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_PartyGroupToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PartyGroupToUser" DROP CONSTRAINT "_PartyGroupToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PartyGroupToUser" DROP CONSTRAINT "_PartyGroupToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "groupUuid";

-- DropTable
DROP TABLE "_PartyGroupToUser";

-- CreateTable
CREATE TABLE "PartyGroupOnUser" (
    "groupUuid" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,

    CONSTRAINT "PartyGroupOnUser_pkey" PRIMARY KEY ("groupUuid","userUuid")
);

-- AddForeignKey
ALTER TABLE "PartyGroupOnUser" ADD CONSTRAINT "PartyGroupOnUser_groupUuid_fkey" FOREIGN KEY ("groupUuid") REFERENCES "PartyGroup"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyGroupOnUser" ADD CONSTRAINT "PartyGroupOnUser_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
