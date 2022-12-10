/*
  Warnings:

  - The primary key for the `Contacts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `contactUuid` on the `Contacts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - The required column `relationUuid` was added to the `Contacts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Contacts" DROP CONSTRAINT "Contacts_contactUuid_fkey";

-- AlterTable
ALTER TABLE "Contacts" DROP CONSTRAINT "Contacts_pkey",
ADD COLUMN     "relationUuid" TEXT NOT NULL,
ALTER COLUMN "uuid" DROP NOT NULL,
ALTER COLUMN "contactUuid" DROP NOT NULL,
ALTER COLUMN "contactUuid" SET DATA TYPE VARCHAR(36),
ADD CONSTRAINT "Contacts_pkey" PRIMARY KEY ("relationUuid");

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_contactUuid_fkey" FOREIGN KEY ("contactUuid") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
